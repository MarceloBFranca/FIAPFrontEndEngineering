export interface Restaurant {
  Id: number;
  Name: string;
  logoUrl: string;
  imageUrl: string; // Imagem maior para a página de detalhes
  description: string;
  address: string;
  estimatedWaitTimePerPerson: number; // Em minutos
}

export interface Queue {
  Id: number;
  IdRestaurant: number;
  ActualOccupation: number;
  ActualPosition: number;
}

// Representa os dados que salvaremos localmente para rastrear o usuário
export interface UserQueueInfo {
  UserId: number;  
  Position: number;
  QueueId: number;
}