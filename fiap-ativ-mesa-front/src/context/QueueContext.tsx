// src/context/QueueContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
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
  loading: true, // Importante: o estado inicial deve ser 'carregando'
};

const QueueContext = createContext<QueueContextData>(defaultContextValue);

export const QueueProvider = ({ children }: { children: ReactNode }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [queues, setQueues] = useState<Queue[]>([]);
  const [loading, setLoading] = useState(true);
  const [userQueues, setUserQueues] = useState<UserQueueInfo[]>([]);

  useEffect(() => {
    // Busca os dados iniciais da API
    const fetchData = async () => {
      try {
        const [resRestaurants, resQueues, resUserQueues] = await Promise.all([
          fetch('http://localhost:3000/api/restaurants'), // Ajuste a URL/porta
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

    // Conecta o socket e define os listeners
    socket.connect();

    const onQueueUpdate = (data: { queues: Queue[], userQueues: UserQueueInfo[] }) => {
      console.log('Fila atualizada via WebSocket:', data);
      setQueues(data.queues);
      setUserQueues(data.userQueues); // <-- ATUALIZA O NOVO ESTADO
    };

    socket.on('queue:update', onQueueUpdate);

    // Função de limpeza para desconectar o socket quando o componente desmontar
    return () => {
      socket.off('queue:update', onQueueUpdate);
      socket.disconnect();
    };
  }, []);

  return (
    <QueueContext.Provider value={{ restaurants, queues, userQueues, loading }}>
      {children}
    </QueueContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export const useQueue = () => {
  return useContext(QueueContext);
};