import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode} from 'react'
import type { Queue, Restaurant, UserQueueInfo } from '../types'; 
import { socket } from '../services/socket';

interface QueueContextData {
  restaurants: Restaurant[];
  queues: Queue[];
  userQueues: UserQueueInfo[]; 
  loading: boolean;
}

const defaultContextValue: QueueContextData = {
  restaurants: [],
  queues: [],
  userQueues: [],
  loading: true, 
};

const QueueContext = createContext<QueueContextData>(defaultContextValue);

export const QueueProvider = ({ children }: { children: ReactNode }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [queues, setQueues] = useState<Queue[]>([]);
  const [loading, setLoading] = useState(true);
  const [userQueues, setUserQueues] = useState<UserQueueInfo[]>([]);

  useEffect(() => {
    socket.connect();

    const onQueueUpdate = (data: { queues: Queue[], userQueues: UserQueueInfo[] }) => {
      console.log(data.queues);
      setQueues(data.queues);
      setUserQueues(data.userQueues);
    };

    socket.on('queue:update', onQueueUpdate);

    return () => {
      socket.off('queue:update', onQueueUpdate);
      socket.disconnect();
    };
  }, []);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resRestaurants, resQueues, resUserQueues] = await Promise.all([
          fetch('http://localhost:5147/api/restaurants'),
          fetch('http://localhost:3000/api/queue'),
          fetch('http://localhost:3000/api/userQueue')
        ]);
        const dataRestaurants = await resRestaurants.json();
        const dataQueues = await resQueues.json();
        const dataUserQueues = await resUserQueues.json();

        setRestaurants(dataRestaurants);
        setQueues(dataQueues);
        setUserQueues(dataUserQueues);
        
      } catch (error) {
        console.error("Erro ao buscar dados iniciais:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loading]);

  return (
    <QueueContext.Provider value={{ restaurants, queues, userQueues, loading }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  return useContext(QueueContext);
};