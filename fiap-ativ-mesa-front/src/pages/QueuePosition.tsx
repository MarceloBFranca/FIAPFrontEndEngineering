import { useState, useEffect, type JSX } from 'react';
import { useQueue } from '../context/QueueContext';
import type { UserQueueInfo, Restaurant, Queue } from '../types';
import { Container, Spinner, Button, Alert } from 'react-bootstrap';
import { AnimatePresence, motion } from 'framer-motion';
import { IoMdPerson } from 'react-icons/io';
import Confetti from 'react-confetti';
import useWindowSize from '../hooks/useWindowSize';
import { useNavigate } from 'react-router-dom';
import './QueuePosition.css';

export const QueuePosition = (): JSX.Element => {
  const { restaurants, queues, userQueues, loading } = useQueue();
  const [userInfo, setUserInfo] = useState<UserQueueInfo | null>(null);
  // Corrigido: Agora usamos setRestaurant para atualizar o restaurante
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [myCurrentPosition, setMyCurrentPosition] = useState<number | null>(null);
  const [myQueueData, setMyQueueData] = useState<Queue | null>(null);
  const { width, height } = useWindowSize();
  const [error, setError] = useState<string | null>(null);
  // Hook useNavigate chamado no nível superior do componente
  const navigate = useNavigate();

  useEffect(() => {
    const storedInfo = localStorage.getItem('userQueueInfo');
    if (storedInfo) {
      setUserInfo(JSON.parse(storedInfo) as UserQueueInfo);
    }
  }, []);

  useEffect(() => {
    if (userInfo && userQueues && restaurants.length > 0 && queues) {
      const myQueueEntry = userQueues.find(u => u.UserId === userInfo.UserId);
      if (myQueueEntry) {
        const queueData = queues.find(q => q.Id === myQueueEntry.QueueId);
        setMyQueueData(queueData || null);

        if (queueData) {
          // Lógica para encontrar e definir o restaurante
          const restaurantData = restaurants.find(r => r.Id === queueData.IdRestaurant);
          setRestaurant(restaurantData || null);

          const currentPosition = myQueueEntry.Position - queueData.ActualPosition;
          setMyCurrentPosition(currentPosition);
        } else {
          setMyCurrentPosition(-1);
          setRestaurant(null);
        }
      } else {
        setMyCurrentPosition(-1);
        setRestaurant(null);
      }
    }
  }, [userInfo, userQueues, restaurants, queues]);

  // Corrigido: handleLeaveQueue definida como uma função async dentro do componente
  const handleLeaveQueue = async () => {
    // Usamos as variáveis de estado e hooks do escopo do componente
    if (!userInfo) {
      setError('Informações do usuário não encontradas.');
      return;
    }
    setError(null); // Limpa erros anteriores

    try {
      const response = await fetch('http://localhost:3000/api/leaveQueue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ UserId: userInfo.UserId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Ocorreu um erro ao tentar sair da fila.');
        return;
      }

      // Limpeza do localStorage e navegação após sucesso
      localStorage.removeItem('userQueueInfo');
      navigate(`/`);

    } catch (err) {
      setError('Falha na comunicação com o servidor. Tente novamente.');
    }
  };

  if (loading || !userInfo || myCurrentPosition === null) {
    return (
      <div className="status-page-background">
        <Container className="text-center">
          <Spinner animation="border" variant="light" />
          <p className="text-white mt-2">Verificando sua posição...</p>
        </Container>
      </div>
    );
  }

  if (myCurrentPosition < 1) {
    return (
      <div className="celebration-background">
        <Confetti width={width} height={height} recycle={false} />
        <div className="celebration-content">
          <h1>É a sua vez!</h1>
          <p>Por favor, dirija-se ao restaurante <strong>{restaurant?.Name}</strong>.</p>
        </div>
      </div>
    );
  }

  if (myCurrentPosition === -1) {
    return (
      <div className="status-page-background">
        <div className="celebration-content">
          <h1>Fila Encerrada</h1>
          <p>A fila para este restaurante foi finalizada ou você não está mais nela.</p>
        </div>
      </div>
    );
  }

  const estimatedWaitTime = restaurant ? (myCurrentPosition - 1) * restaurant.estimatedWaitTimePerPerson : 0;

  return (
    <div className="status-page-background">
      <Container>
        <div className="status-card">
          <p className="card-subtitle">Sua posição na fila para</p>
          <h2 className="card-restaurant-title">{restaurant?.Name || 'Carregando...'}</h2>
          
          <div className="position-display">
            <AnimatePresence mode="wait">
              <motion.h1
                key={myCurrentPosition}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="position-number"
              >
                {myCurrentPosition}º
              </motion.h1>
            </AnimatePresence>
          </div>
          
          <div className="details-grid">
            <div>
              <span>Chamando Senha</span>
              <strong>{myQueueData?.ActualPosition || '-'}</strong>
            </div>
            <div>
              <span>Sua Senha</span>
              {/* Utilizando userInfo do estado para garantir consistência */}
              <strong>{userQueues.find(u => u.UserId === userInfo.UserId)?.Position || '-'}</strong>
            </div>
            <div>
              <span>Espera Estimada</span>
              <strong>~{estimatedWaitTime} min</strong>
            </div>
          </div>
        </div>

        <div className="visual-queue">
          {/* Lógica de visualização da fila */}
        </div>
        
        {/* Corrigido: Texto do botão sem aspas e onClick aponta para a função correta */}
        <Button
          variant="danger"
          className="mt-4"
          onClick={handleLeaveQueue}
        >
          Sair da Fila
        </Button>
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      </Container>
    </div>
  );
};