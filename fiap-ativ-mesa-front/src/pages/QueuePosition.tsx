import React, { useState, useEffect, type JSX } from 'react';
import { useQueue } from '../context/QueueContext';
import type { UserQueueInfo, Restaurant, Queue } from '../types';
import { Container, Card, Spinner } from 'react-bootstrap';
import { AnimatePresence, motion } from 'framer-motion';
import { IoMdPerson } from 'react-icons/io';
import Confetti from 'react-confetti';
import useWindowSize from '../hooks/useWindowSize';
import './QueuePosition.css';

export const QueuePosition = (): JSX.Element => {
  const { restaurants, queues, userQueues, loading } = useQueue();
  const [userInfo, setUserInfo] = useState<UserQueueInfo | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [myCurrentPosition, setMyCurrentPosition] = useState<number | null>(null);
  const [myQueueData, setMyQueueData] = useState<Queue | null>(null);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const storedInfo = localStorage.getItem('userQueueInfo');
    if (storedInfo) {
      setUserInfo(JSON.parse(storedInfo) as UserQueueInfo);
    }
  }, []);

  // EFEITO PRINCIPAL COM A LÓGICA 100% CORRIGIDA
  useEffect(() => {
    if (userInfo && userQueues && restaurants.length > 0 && queues) {
      // CORREÇÃO 1: O backend envia 'UserId' (maiúsculo), então buscamos por ele.
      const myQueueEntry = userQueues.find(u => u.UserId === userInfo.UserId);
      // const myRestaurant = restaurants.find(r => r.Id === userInfo.restaurantId);
      
      // setRestaurant(myRestaurant || null);

      if (myQueueEntry) {
        const queueData = queues.find(q => q.Id === myQueueEntry.QueueId);
        setMyQueueData(queueData || null);

        if (queueData) {
          // CORREÇÃO 2: Usamos 'myQueueEntry.Position' (com 'P' maiúsculo), que é o dado real vindo do backend.
          // A fórmula (Senha do Usuário - Senha Chamada + 1) nos dá a posição na fila (1º, 2º, etc.).
          const currentPosition = myQueueEntry.Position - queueData.ActualPosition + 1;
          setMyCurrentPosition(currentPosition);
        } else {
          setMyCurrentPosition(-1);
        }
      } else {
        setMyCurrentPosition(-1); 
      }
    }
    // CORREÇÃO 3: A dependência de 'myQueueData' é removida para evitar o bug de estado obsoleto.
  }, [userInfo, userQueues, restaurants, queues]);

  // --- RENDERIZAÇÃO CONDICIONAL ---

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

  // A condição `myCurrentPosition <= 1` agora funciona corretamente.
  // Se for a sua vez, a posição será 1. Se você for o próximo, será 2.
  if (myCurrentPosition <= 1) {
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
          <p>A fila para o restaurante <strong>{restaurant?.Name}</strong> foi finalizada.</p>
        </div>
      </div>
    );
  }

  // A espera estimada agora é (posição - 1) * tempo, pois se você é o 2º, tem 1 pessoa na sua frente.
  const estimatedWaitTime = restaurant ? (myCurrentPosition - 1) * restaurant.estimatedWaitTimePerPerson : 0;

  return (
    <div className="status-page-background">
      <Container>
        <div className="status-card">
          <p className="card-subtitle">Sua posição na fila para</p>
          <h2 className="card-restaurant-title">{restaurant?.Name}</h2>
          
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
              {/* CORREÇÃO 4: Usamos a senha real do usuário (myQueueEntry) em vez do que estava no localStorage */}
              <span>Sua Senha</span>
              <strong>{userQueues.find(u => u.UserId === userInfo.UserId)?.Position || '-'}</strong>
            </div>
            <div>
              <span>Espera Estimada</span>
              <strong>~{estimatedWaitTime} min</strong>
            </div>
          </div>
        </div>

        <div className="visual-queue">
          {myCurrentPosition > 3 && <div className="queue-person-etc">...</div>}
          {myCurrentPosition > 2 && <div className="queue-person"><IoMdPerson size={30} /></div>}
          <div className="queue-person is-you"><IoMdPerson size={40} /><span>Você</span></div>
          {myCurrentPosition < 5 && <div className="queue-person"><IoMdPerson size={30} /></div>}
          {myCurrentPosition < 4 && <div className="queue-person-etc">...</div>}
        </div>
      </Container>
    </div>
  );
};