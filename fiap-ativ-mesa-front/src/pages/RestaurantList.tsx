import { Badge, Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import './RestaurantList.css'; 

export const RestaurantList = () => {
  const { restaurants, queues, loading, summary } = useQueue();

  if (loading || !restaurants || !queues) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
        <p>Carregando restaurantes...</p>
      </Container>
    );
  }

  return (
    
    <div className="main-container">
      <header className="page-header-redesigned text-center">
        <Container>
          <h1>Restaurantes Disponíveis</h1>
          <p>Escolha um local, veja a fila e garanta seu lugar com um clique.</p>
        </Container>
      </header>

      <Container className="py-5">
        <Row xs={1} md={2} lg={3} className="g-4 mt-4">
          {summary.map(restaurant => {
            // const queueInfo = queues.find(q => q.IdRestaurant === restaurant.id);
            // const occupation = queueInfo ? queueInfo.ActualOccupation - queueInfo.ActualPosition : 0;
             const hasQueue = restaurant.currentOccupation > 0;

            return (
              <Col key={restaurant.restaurantId}>
                <Link to={`/restaurant/${restaurant.restaurantId}`} className="card-link text-decoration-none">                  
                  <Card className="h-100 restaurant-card">
                    <Card.Img variant="top" src={restaurant.restaurantLogo} />
                    <Card.Body>
                      <Card.Title>{restaurant.restaurantName}</Card.Title>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <Card.Text className="mb-0">
                          Pessoas na fila: <strong>{restaurant.currentOccupation}</strong>
                        </Card.Text>
                        <Badge pill bg={hasQueue ? "danger" : "success"} className="px-3 py-2">
                          {hasQueue ? "Em Espera" : "Livre"}
                        </Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
};