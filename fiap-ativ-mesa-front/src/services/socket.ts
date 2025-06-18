// src/services/socket.ts
import { io } from 'socket.io-client';

// Altere para a URL do seu backend
const SOCKET_URL = 'http://localhost:3000'; // Exemplo, ajuste a porta se necessário

export const socket = io(SOCKET_URL, {
  autoConnect: false // Conectaremos manualmente dentro de um componente React
});