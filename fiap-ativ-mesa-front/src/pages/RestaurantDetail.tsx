import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { Container, Row, Col, Image, Button, Spinner, Alert, Card } from 'react-bootstrap';
import type { UserQueueInfo } from '../types';
import './RestaurantDetail.css'; 

export const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { restaurants, queues, loading } = useQueue(); 
  
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const restaurant = restaurants.find(r => r.Id === Number(id));
  const queueInfo = queues.find(q => q.IdRestaurant === Number(id));
  const occupation = queueInfo ? queueInfo.ActualOccupation : 0;

  if (loading) {
    return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
  }

  if (!restaurant) {
    return <Container className="text-center mt-5"><h1>Restaurante não encontrado.</h1></Container>;
  }

  const estimatedWaitTime = occupation * restaurant.estimatedWaitTimePerPerson;

  const handleJoinQueue = async () => {
    setIsJoining(true);
    setError(null);

    const mockUserId = Math.floor(Math.random() * 2000); 

    try {
      const response = await fetch('http://localhost:3000/api/joinQueue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ UserId: mockUserId, IdRestaurant: Number(id) }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Ocorreu um erro.');
        return;
      }
      
      const relevantQueue = data.queue.find((q: { IdRestaurant: number; }) => q.IdRestaurant === Number(id));
      if(relevantQueue) {
        const userInfo: UserQueueInfo = {
          UserId: mockUserId,          
          Position: relevantQueue.ActualOccupation,
          QueueId: relevantQueue.Id
        };
        localStorage.setItem('userQueueInfo', JSON.stringify(userInfo));
        navigate(`/queue/${mockUserId}`);
      }
    } catch (err) {
      setError('Falha na comunicação com o servidor. Tente novamente.');
    } finally {
      setIsJoining(false);
    }
  };
  
  
  return (
    <div className="detail-page-background">
      <Container className="py-5">
        <Row className="align-items-center">
          <Col md={6}>
            <Image src={restaurant.imageUrl} rounded fluid className="restaurant-image" />
          </Col>

          <Col md={6} className="mt-4 mt-md-0">
            <h1 className="restaurant-title">{restaurant.Name}</h1>
            <p className="restaurant-address">{restaurant.address}</p>
            <p className="restaurant-description">{restaurant.description}</p>
            
            <Card className="queue-info-box my-4">
              <Card.Body>
                <Row>
                  <Col>
                    <div className="info-item">
                      <span>Pessoas na Fila</span>
                      <strong>{occupation}</strong>
                    </div>
                  </Col>
                  <Col>
                    <div className="info-item">
                      <span>Espera Estimada</span>
                      <strong>~{estimatedWaitTime} min</strong>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="d-grid">
              <Button 
                onClick={handleJoinQueue} 
                disabled={isJoining} 
                size="lg"
                variant="primary"
              >
                {isJoining ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" /> Entrando na fila...
                  </>
                ) : 'Entrar na Fila'}
              </Button>
            </div>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          </Col>
        </Row>
      </Container>
    </div>
  );
};