# Event-Driven Social Media Platform

A high-performance backend system designed to demonstrate the power of distributed systems. This project focuses on real-time post propagation and efficient feed generation using an event-driven architecture.

## Overview

This platform is built to handle the challenges of modern social media scaling. By using an asynchronous approach, the system decouples the act of posting from the complex task of updating thousands of follower feeds. The result is a highly responsive API that remains stable even during traffic spikes.

## Architecture

The system is organized into three specialized layers to ensure a clean separation of concerns:

### 1. API Layer
Built with Node.js and Express, this layer serves as the entry point for users. It handles authentication (logic prepared for future JWT integration) and accepts incoming requests like post creation and feed retrieval.

### 2. Event Streaming Layer
Apache Kafka acts as the central nervous system. When a post is created, an event is published to a dedicated Kafka topic, ensuring the data is persisted and ready for downstream processing without blocking the user.

### 3. Processing Layer
The Consumer Service acts as the worker engine. It listens for Kafka events and performs the "fan-out" process—pushing the new post data into the Redis-based timelines of every follower.

---

## System Flow

1. A User submits a post through the REST API.
2. The API acknowledges the request and immediately publishes a Post Created event to Kafka.
3. The Consumer Service picks up the event from the Kafka topic.
4. The service identifies the author's followers and performs a fan-out operation.
5. The processed feed is stored in Redis, allowing followers to retrieve their latest updates in milliseconds.

---

## Tech Stack

* Backend: Node.js and Express.js
* Message Broker: Apache Kafka
* In-Memory Data Store: Redis
* Primary Database: PostgreSQL
* Infrastructure: Docker and Docker Compose

---

## Features

* Fast Post Creation: Non-blocking API requests via Kafka integration.
* Real-Time Updates: Automated feed generation triggered by events.
* Optimized Retrieval: Redis caching ensures feeds load instantly.
* Built-in Reliability: Deduplication logic using Redis keys to prevent repetitive data.
* Scalable Design: Easily add more consumers to handle growing user bases.

---

## How to Run the Project

Follow these steps to get the environment up and running:

Step 1: Start the infrastructure (Kafka, Redis, PostgreSQL)
docker compose up -d

Step 2: Start the API server
node src/server.js

Step 3: Start the consumer service
node src/index.js

---

## API Endpoints

### Create Post
POST /create-post
Request Body:
{
  "userId": 1,
  "content": "Hello world"
}
Response: Confirms the post event is published to Kafka.

### Get Feed
GET /feed/:userId
Response: Returns a list of posts for the specific user directly from the Redis cache.

---

## Key Design Decisions

* Asynchronous Communication: Using Kafka removes direct dependencies between services, preventing a failure in one area from crashing the entire system.
* Read/Write Separation: We use a CQRS-style approach where writes go through Kafka and PostgreSQL, while reads are served exclusively from a lightning-fast Redis layer.
* Data Integrity: Redis keys are used not just for storage, but for deduplication to ensure feed consistency.

---

## Project Highlights

* Clean service separation for maintainable code.
* Implementation of real-world distributed system patterns.
* Scalable fan-out architecture similar to major social platforms.
* Production-ready backend structure using containerization.



Future Improvements

* Add a robust authentication system using JWT.
* Full persistence for posts and user relationships in PostgreSQL.
* Implement pagination for the Feed API to handle long timelines.
* Optimization of the fan-out process for "celebrity" accounts with millions of followers.
* Expansion into a Notification Service for likes, tags, and comments.

---

## Author

This project was developed as a deep-dive into scalable backend design, focused on mastering distributed systems and event-driven architecture.
