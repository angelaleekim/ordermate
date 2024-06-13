import React, { useState } from "react";
import { useTransition, animated } from "react-spring";
import { useSwipeable } from "react-swipeable";
import "./App.css";

const initialOrders = {
  active: [
    {
      id: 1,
      items: { "Masala Dosa": 1, "Filter Coffee": 2 },
      payment: "Zelle",
      customer: "Sai Rama",
    },
    {
      id: 2,
      items: { "Podi Dosa": 1, "Filter Coffee": 1 },
      payment: "Venmo",
      customer: "Madi",
    },
    { id: 3, items: { "Plain Dosa": 2 }, payment: "Venmo", customer: "Arun" },
    {
      id: 4,
      items: { "Masala Dosa": 1, "Podi Dosa": 1, "Filter Coffee": 1 },
      payment: "Zelle",
      customer: "Jini",
    },
  ],
  upcoming: [
    {
      id: 5,
      items: { "Masala Dosa": 2, "Filter Coffee": 1 },
      payment: "Zelle",
      customer: "Nyasa",
    },
    {
      id: 6,
      items: { "Plain Dosa": 1, "Filter Coffee": 1 },
      payment: "Venmo",
      customer: "Nitya",
    },
    { id: 7, items: { "Podi Dosa": 2 }, payment: "Venmo", customer: "Vicki" },
    {
      id: 8,
      items: { "Masala Dosa": 2, "Podi Dosa": 1, "Filter Coffee": 1 },
      payment: "Venmo",
      customer: "Maggie",
    },
  ],
  completed: [
    {
      id: 9,
      items: { "Masala Dosa": 1, "Filter Coffee": 2 },
      payment: "Zelle",
      customer: "Tom",
    },
    {
      id: 10,
      items: { "Podi Dosa": 1, "Filter Coffee": 1 },
      payment: "Venmo",
      customer: "Dani",
    },
    { id: 11, items: { "Plain Dosa": 2 }, payment: "Venmo", customer: "Jeff" },
    {
      id: 12,
      items: { "Masala Dosa": 1, "Podi Dosa": 1, "Filter Coffee": 1 },
      payment: "Zelle",
      customer: "Lanaya",
    },
  ],
};

const OrderCard = ({ order, onClick }) => (
  <div className="order-card" onClick={() => onClick(order)}>
    <div className="order-items">
      {Object.entries(order.items).map(([item, quantity]) => (
        <div key={item}>
          <span>{item}</span>
          <span>{quantity}</span>
        </div>
      ))}
    </div>
    <div className="order-payment">{order.payment}</div>
    <div className="order-customer">{order.customer}</div>
  </div>
);

const OrderSection = ({ title, orders, onClick, onSwipe }) => {
  const transitions = useTransition(orders, {
    keys: (order) => order.id,
    from: { opacity: 0, transform: "translate3d(100%,0,0)" },
    enter: { opacity: 1, transform: "translate3d(0%,0,0)" },
    leave: { opacity: 0, transform: "translate3d(-50%,0,0)" },
  });

  const handlers = useSwipeable({
    onSwipedLeft: () => onSwipe(),
    onSwipedRight: () => onSwipe(),
  });

  return (
    <div className="order-section" {...handlers}>
      <h2>{title}</h2>
      <div className="order-cards">
        {transitions((style, order) => (
          <animated.div style={style}>
            <OrderCard key={order.id} order={order} onClick={onClick} />
          </animated.div>
        ))}
      </div>
    </div>
  );
};

const OrderDetails = ({ order, onComplete, onMoveToActive }) => {
  return (
    <div className="order-details">
      <h2>Order Details</h2>
      <div className="order-items">
        {Object.entries(order.items).map(([item, quantity]) => (
          <div key={item} className="order-item">
            <span className="item-name">{item}</span>
            <span className="item-quantity">{quantity}</span>
          </div>
        ))}
      </div>
      <div className="order-payment">Payment: {order.payment}</div>
      <div className="order-customer">Customer: {order.customer}</div>
      {onComplete && (
        <button onClick={() => onComplete(order)}>Complete Order</button>
      )}
      {onMoveToActive && (
        <button onClick={() => onMoveToActive(order)}>
          Move to Active Orders
        </button>
      )}
    </div>
  );
};

function App() {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  const handleCompleteOrder = (order) => {
    setOrders((prevOrders) => ({
      ...prevOrders,
      active: prevOrders.active.filter((o) => o.id !== order.id),
      completed: [...prevOrders.completed, order],
    }));
    setSelectedOrder(null);
  };

  const handleMoveToActive = (order) => {
    setOrders((prevOrders) => ({
      ...prevOrders,
      upcoming: prevOrders.upcoming.filter((o) => o.id !== order.id),
      active: [...prevOrders.active, order],
    }));
    setSelectedOrder(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>OrderMate</h1>
      </header>
      <main>
        <OrderSection
          title="Active Orders"
          orders={orders.active}
          onClick={handleOrderClick}
          onSwipe={() => {
            const newOrder = orders.upcoming.shift();
            if (newOrder) {
              setOrders((prevOrders) => ({
                ...prevOrders,
                active: [...prevOrders.active, newOrder],
                upcoming: [...prevOrders.upcoming],
              }));
            }
          }}
        />
        <OrderSection
          title="Upcoming Orders"
          orders={orders.upcoming}
          onClick={handleOrderClick}
          onSwipe={() => {
            const newOrder = orders.upcoming.shift();
            if (newOrder) {
              setOrders((prevOrders) => ({
                ...prevOrders,
                active: [...prevOrders.active, newOrder],
                upcoming: [...prevOrders.upcoming],
              }));
            }
          }}
        />
        <OrderSection
          title="Completed Orders"
          orders={orders.completed}
          onClick={handleOrderClick}
          onSwipe={() => {
            const newOrder = orders.active.shift();
            if (newOrder) {
              setOrders((prevOrders) => ({
                ...prevOrders,
                completed: [...prevOrders.completed, newOrder],
                active: [...prevOrders.active],
              }));
            }
          }}
        />
        {selectedOrder && (
          <OrderDetails
            order={selectedOrder}
            onComplete={
              orders.active.find((o) => o.id === selectedOrder.id)
                ? handleCompleteOrder
                : null
            }
            onMoveToActive={
              orders.upcoming.find((o) => o.id === selectedOrder.id)
                ? handleMoveToActive
                : null
            }
          />
        )}
      </main>
    </div>
  );
}

export default App;
