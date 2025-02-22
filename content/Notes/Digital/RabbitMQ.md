Rabbit MQ is a [[Message Broker]] based around a [[Queue]] architecture. Unlike other brokers RabbitMQ ensures [[FIFO]] which can be especially critical for background service management unless Sharding is implemented.

RabbitMQ uses [[AMQP]] which allows for both [[PubSub]] and server client architectures compared to [[MQTT]] based brokers.

RabbitMQ does however have non-negligible overheads meaning it is less used in low latency and high frequency applications.