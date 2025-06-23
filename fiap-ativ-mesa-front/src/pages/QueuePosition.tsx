import { useState, useEffect, type JSX } from 'react';
import { useQueue } from '../context/QueueContext';
import type { UserQueueInfo, Restaurant, Queue } from '../types';
import { Container, Spinner } from 'react-bootstrap';
import { AnimatePresence, motion } from 'framer-motion';
import { IoMdPerson } from 'react-icons/io';
import Confetti from 'react-confetti';
import useWindowSize from '../hooks/useWindowSize';
import './QueuePosition.css';

export const QueuePosition = (): JSX.Element => {
  const { restaurants, queues, userQueues, loading } = useQueue();
  const [userInfo, setUserInfo] = useState<UserQueueInfo | null>(null);
  const [restaurant, _] = useState<Restaurant | null>(null);
  const [myCurrentPosition, setMyCurrentPosition] = useState<number | null>(null);
  const [myQueueData, setMyQueueData] = useState<Queue | null>(null);
  const { width, height } = useWindowSize();

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
          const currentPosition = myQueueEntry.Position - queueData.ActualPosition + 1;
          setMyCurrentPosition(currentPosition);
        } else {
          setMyCurrentPosition(-1);
        }
      } else {
        setMyCurrentPosition(-1); 
      }
    }
  }, [userInfo, userQueues, restaurants, queues]);

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