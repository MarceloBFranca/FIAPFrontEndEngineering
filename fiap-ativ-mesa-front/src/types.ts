export interface Restaurant {
  id: number;
  name: string;
  logoUrl: string;
  imageUrl: string;
  description: string;
  address: string;
  estimatedWaitTimePerPerson: number;
}

export interface Queue {
  Id: number;
  IdRestaurant: number;
  ActualOccupation: number;
  ActualPosition: number;
}

export interface UserQueueInfo {
  UserId: number;  
  Position: number;
  QueueId: number;
}