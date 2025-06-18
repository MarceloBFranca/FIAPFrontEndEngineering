import React from 'react';
import { Link } from 'react-router-dom';
import { useQueue } from '../context/QueueContext';
import { Container, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
// Certifique-se de que o CSS está importado se você o estiver usando
// import './RestaurantList.css'; 

export const RestaurantList = () => {
  // A desestruturação continua a mesma
  const { restaurants, queues, loading } = useQueue();

  // Guarda nº 1: Verifica o estado de carregamento global do contexto.
  // Isso cobre a busca inicial de dados.
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
        <p>Carregando restaurantes...</p>
      </Container>
    );
  }

  // GUARDA DE SEGURANÇA Nº 2 (A NOVA LINHA)
  // Verifica se 'queues' não é undefined, null, ou qualquer outra coisa que não seja um array.
  // Se não for um array válido, não renderiza nada e aguarda o próximo estado.
  if (!Array.isArray(queues)) {
    return null; // ou você pode retornar o Spinner novamente se preferir
  }

  // A partir deste ponto, temos 100% de certeza que `loading` é false e `queues` é um array.
  // O código restante agora é seguro.
  return (
    <Container className="py-5"> 
      <div className="page-header text-center">
        <h1>Restaurantes Disponíveis</h1>
        <p>Escolha um local, veja a fila e garanta seu lugar com um clique.</p>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4 mt-4">
        {restaurants.map(restaurant => {
          // Esta linha agora está protegida e não causará mais o erro.
          const queueInfo = queues.find(q => q.IdRestaurant === restaurant.Id);
          const occupation = queueInfo ? queueInfo.ActualOccupation : 0;
          const hasQueue = occupation > 0;

          return (
            <Col key={restaurant.Id}>
              <Link to={`/restaurant/${restaurant.Id}`} className="card-link text-decoration-none">
                <Card className="h-100 restaurant-card">
                  <Card.Img variant="top" src={restaurant.logoUrl} />
                  <Card.Body>
                    <Card.Title>{restaurant.Name}</Card.Title>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <Card.Text className="mb-0">
                        Pessoas na fila: <strong>{occupation}</strong>
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
  );
};