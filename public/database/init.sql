CREATE DATABASE IF NOT EXISTS `vending_machine` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `vending_machine`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: vending_machine
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `item_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_cost` decimal(5,2) NOT NULL,
  `item_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `availability` tinyint DEFAULT NULL,
  `item_quantity` int DEFAULT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` VALUES (1,'Coca-Cola Canned Drink',1.00,'coca-cola.png',0,50),(2,'Sprite Canned Drink',1.30,'sprite.png',1,50),(3,'100Plus Canned Drink',1.50,'100plus.png',0,50),(4,'Dasani Bottled Water',1.10,'dasani.png',0,50),(5,'Milo Packet',1.70,'milo.png',1,50),(6,'Lays Chips (Regular)',2.00,'lays-reg.png',0,80),(7,'Lays Chips (BBQ)',2.00,'lays-bbq.png',1,80),(8,'Ruffles (Regular)',2.30,'ruffles.png',1,80),(9,'Doritos (Regular)',2.50,'doritos.png',1,80),(10,'Cheetos (Regular)',2.70,'cheetos.png',1,80),(11,'Ruffles (Sour Cream & Onion)',2.30,'1737042518023.png',0,NULL),(12,'Blue Takis',2.10,'1737042905412.png',0,NULL),(13,'Ruffles (Sour Cream & Onion)',2.50,'1737100611307.png',NULL,NULL),(14,'HL Milk (200ml)',2.00,'1737701124626.png',NULL,NULL),(15,'\"Pokka Green Tea Canned Drink\"',1.00,'1737702925103.jpg',NULL,NULL);
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location` (
  `location_id` int NOT NULL AUTO_INCREMENT,
  `school` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `block` int NOT NULL,
  `floor` int NOT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES (1,'School of Informatics & IT (IIT)',3,3),(2,'School of Applied Science (ASC)',7,3),(3,'School of Business (BUS)',26,3),(4,'School of Business (BUS)',26,4),(5,'School of Design (DES)',28,3),(6,'School of Design (DES)',28,5),(7,'School of Engineering (ENG)',15,3),(8,'School of Engineering (ENG)',15,5),(9,'School of Humanities & Social Sciences (HSS)',1,2),(10,'School of Humanities & Social Sciences (HSS)',1,3);
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `machine_items`
--

DROP TABLE IF EXISTS `machine_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `machine_items` (
  `machine_id` int NOT NULL,
  `item_id` int NOT NULL,
  `quantity_of_items` int DEFAULT NULL,
  `item_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`machine_id`,`item_id`),
  KEY `fk_item_id` (`item_id`),
  CONSTRAINT `fk_item_id` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`),
  CONSTRAINT `machine_items_ibfk_1` FOREIGN KEY (`machine_id`) REFERENCES `vending_machine` (`vending_machine_id`),
  CONSTRAINT `machine_items_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `machine_items`
--

LOCK TABLES `machine_items` WRITE;
/*!40000 ALTER TABLE `machine_items` DISABLE KEYS */;
INSERT INTO `machine_items` VALUES (1,1,50,NULL),(1,2,1,NULL),(1,9,8,'Doritos (Regular)'),(1,10,8,'Cheetos (Regular)'),(1,11,20,NULL),(1,12,10,NULL),(2,4,100,'Dasani Bottled Water'),(2,5,5,'Milo Packet'),(2,6,8,'Lays Chips (Regular)'),(2,7,12,'Lays Chips (BBQ)'),(2,8,8,'Ruffles (Regular)'),(2,9,8,'Doritos (Regular)'),(2,10,8,'Cheetos (Regular)'),(3,1,1,NULL),(3,2,5,'Sprite Canned Drink'),(3,4,1,NULL),(3,5,5,'Milo Packet'),(3,6,8,'Lays Chips (Regular)'),(3,7,8,'Lays Chips (BBQ)'),(3,8,8,'Ruffles (Regular)'),(3,9,8,'Doritos (Regular)'),(3,10,8,'Cheetos (Regular)'),(3,11,200,NULL),(3,12,3,NULL),(3,13,20,NULL),(4,1,5,'Coca-Cola Canned Drink'),(4,2,5,NULL),(4,3,10,'100Plus Canned Drink'),(4,5,5,'Milo Packet'),(4,6,8,'Lays Chips (Regular)'),(4,9,8,'Doritos (Regular)'),(4,10,8,'Cheetos (Regular)'),(5,1,5,'Coca-Cola Canned Drink'),(5,5,5,'Milo Packet'),(5,6,8,'Lays Chips (Regular)'),(5,8,8,'Ruffles (Regular)'),(5,9,8,'Doritos (Regular)'),(5,10,8,'Cheetos (Regular)'),(6,1,6,'Coca-Cola Canned Drink'),(6,3,6,'100Plus Canned Drink'),(6,4,6,'Dasani Bottled Water'),(6,5,6,'Milo Packet'),(6,6,8,'Lays Chips (Regular)'),(6,8,8,'Ruffles (Regular)'),(6,9,8,'Doritos (Regular)'),(6,10,8,'Cheetos (Regular)'),(7,2,5,'Sprite Canned Drink'),(7,4,5,'Dasani Bottled Water'),(7,5,5,'Milo Packet'),(7,6,8,'Lays Chips (Regular)'),(7,7,8,'Lays Chips (BBQ)'),(7,9,8,'Doritos (Regular)'),(7,10,8,'Cheetos (Regular)'),(8,2,5,'Sprite Canned Drink'),(8,4,5,'Dasani Bottled Water'),(8,5,5,'Milo Packet'),(8,6,8,'Lays Chips (Regular)'),(8,7,8,'Lays Chips (BBQ)'),(8,9,8,'Doritos (Regular)'),(8,10,8,'Cheetos (Regular)'),(9,2,5,'Sprite Canned Drink'),(9,4,5,'Dasani Bottled Water'),(9,5,5,'Milo Packet'),(9,6,9,'Lays Chips (Regular)'),(9,7,9,'Lays Chips (BBQ)'),(9,9,9,'Doritos (Regular)'),(9,10,9,'Cheetos (Regular)'),(10,1,5,'Coca-Cola Canned Drink'),(10,4,5,'Dasani Bottled Water'),(10,5,5,'Milo Packet'),(10,6,8,'Lays Chips (Regular)'),(10,8,8,'Ruffles (Regular)'),(10,9,8,'Doritos (Regular)'),(10,10,8,'Cheetos (Regular)');
/*!40000 ALTER TABLE `machine_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operation_logs`
--

DROP TABLE IF EXISTS `operation_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `operation_logs` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `operation` varchar(50) NOT NULL,
  `machine_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `machine_id` (`machine_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `operation_logs_ibfk_1` FOREIGN KEY (`machine_id`) REFERENCES `vending_machine` (`vending_machine_id`),
  CONSTRAINT `operation_logs_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operation_logs`
--

LOCK TABLES `operation_logs` WRITE;
/*!40000 ALTER TABLE `operation_logs` DISABLE KEYS */;
INSERT INTO `operation_logs` VALUES (1,'StatusUpdate',1,NULL,4,'2025-01-17 11:35:41'),(2,'UpdateItem',1,2,10,'2025-01-17 11:35:41'),(3,'UpdateItem',1,3,100,'2025-01-17 11:35:41'),(4,'UpdateItem',1,6,8,'2025-01-17 11:35:41'),(5,'UpdateItem',1,7,8,'2025-01-17 11:35:41'),(6,'UpdateItem',1,8,8,'2025-01-17 11:35:41'),(7,'UpdateItem',1,9,8,'2025-01-17 11:35:41'),(8,'UpdateItem',1,10,8,'2025-01-17 11:35:41'),(9,'UpdateItem',1,11,20,'2025-01-17 11:35:41'),(10,'AddItem',1,12,10,'2025-01-17 11:39:14'),(11,'Delete',2,1,0,'2025-01-17 15:47:40'),(12,'StatusUpdate',2,NULL,2,'2025-01-17 15:48:31'),(13,'UpdateItem',2,4,100,'2025-01-17 15:48:31'),(14,'UpdateItem',2,5,5,'2025-01-17 15:48:31'),(15,'UpdateItem',2,6,8,'2025-01-17 15:48:31'),(16,'UpdateItem',2,7,12,'2025-01-17 15:48:31'),(17,'UpdateItem',2,8,8,'2025-01-17 15:48:31'),(18,'UpdateItem',2,9,8,'2025-01-17 15:48:31'),(19,'UpdateItem',2,10,8,'2025-01-17 15:48:31'),(20,'AddToDatabase',NULL,13,NULL,'2025-01-17 15:56:51'),(21,'StatusUpdate',1,NULL,2,'2025-01-21 19:19:45'),(22,'StatusUpdate',1,NULL,2,'2025-01-21 19:23:24'),(23,'UpdateItem',1,2,11,'2025-01-21 19:23:25'),(24,'UpdateItem',1,3,100,'2025-01-21 19:23:25'),(25,'UpdateItem',1,6,8,'2025-01-21 19:23:25'),(26,'UpdateItem',1,7,8,'2025-01-21 19:23:26'),(27,'UpdateItem',1,8,8,'2025-01-21 19:23:26'),(28,'UpdateItem',1,9,8,'2025-01-21 19:23:26'),(29,'UpdateItem',1,10,8,'2025-01-21 19:23:26'),(30,'UpdateItem',1,11,20,'2025-01-21 19:23:27'),(31,'UpdateItem',1,12,10,'2025-01-21 19:23:27'),(32,'StatusUpdate',2,NULL,2,'2025-01-21 19:25:28'),(33,'UpdateItem',2,4,100,'2025-01-21 19:25:28'),(34,'UpdateItem',2,5,5,'2025-01-21 19:25:28'),(35,'UpdateItem',2,6,8,'2025-01-21 19:25:28'),(36,'UpdateItem',2,7,12,'2025-01-21 19:25:28'),(37,'UpdateItem',2,8,8,'2025-01-21 19:25:28'),(38,'UpdateItem',2,9,8,'2025-01-21 19:25:28'),(39,'UpdateItem',2,10,8,'2025-01-21 19:25:28'),(40,'StatusUpdate',2,NULL,4,'2025-01-21 19:26:11'),(41,'UpdateItem',2,4,100,'2025-01-21 19:26:11'),(42,'UpdateItem',2,5,5,'2025-01-21 19:26:11'),(43,'UpdateItem',2,6,8,'2025-01-21 19:26:11'),(44,'UpdateItem',2,7,12,'2025-01-21 19:26:11'),(45,'UpdateItem',2,8,8,'2025-01-21 19:26:11'),(46,'UpdateItem',2,9,8,'2025-01-21 19:26:11'),(47,'UpdateItem',2,10,8,'2025-01-21 19:26:11'),(48,'AddItem',3,12,3,'2025-01-21 19:26:29'),(49,'Delete',3,4,0,'2025-01-21 19:26:47'),(50,'StatusUpdate',2,NULL,4,'2025-01-22 09:14:43'),(51,'UpdateItem',2,4,100,'2025-01-22 09:14:43'),(52,'UpdateItem',2,5,5,'2025-01-22 09:14:43'),(53,'UpdateItem',2,6,8,'2025-01-22 09:14:43'),(54,'UpdateItem',2,7,12,'2025-01-22 09:14:43'),(55,'UpdateItem',2,8,8,'2025-01-22 09:14:43'),(56,'UpdateItem',2,9,8,'2025-01-22 09:14:43'),(57,'UpdateItem',2,10,8,'2025-01-22 09:14:43'),(58,'StatusUpdate',1,NULL,2,'2025-01-22 09:15:29'),(59,'UpdateItem',1,2,11,'2025-01-22 09:15:29'),(60,'UpdateItem',1,3,1,'2025-01-22 09:15:29'),(61,'UpdateItem',1,6,8,'2025-01-22 09:15:29'),(62,'UpdateItem',1,7,8,'2025-01-22 09:15:29'),(63,'UpdateItem',1,8,8,'2025-01-22 09:15:29'),(64,'UpdateItem',1,9,8,'2025-01-22 09:15:29'),(65,'UpdateItem',1,10,8,'2025-01-22 09:15:29'),(66,'UpdateItem',1,11,20,'2025-01-22 09:15:29'),(67,'UpdateItem',1,12,10,'2025-01-22 09:15:29'),(68,'Delete',3,1,0,'2025-01-22 09:38:13'),(69,'AddItem',3,1,1,'2025-01-22 09:39:10'),(70,'UpdateItem',1,3,1,'2025-01-22 09:49:40'),(71,'UpdateItem',1,3,30,'2025-01-22 09:49:50'),(72,'Delete',5,4,0,'2025-01-24 10:07:19'),(73,'Delete',1,2,0,'2025-01-24 10:07:38'),(74,'StatusUpdate',1,NULL,1,'2025-01-24 10:10:48'),(75,'StatusUpdate',1,NULL,2,'2025-01-24 10:13:45'),(76,'StatusUpdate',1,NULL,3,'2025-01-24 10:14:14'),(77,'StatusUpdate',1,NULL,4,'2025-01-24 10:14:32'),(78,'StatusUpdate',1,NULL,2,'2025-01-24 10:16:31'),(79,'StatusUpdate',1,NULL,3,'2025-01-24 10:18:15'),(80,'AddItem',1,2,1,'2025-01-24 12:38:26'),(81,'AddItem',3,4,1,'2025-01-24 12:38:55'),(82,'UpdateItem',1,1,1,'2025-01-24 13:16:34'),(83,'UpdateItem',1,1,1,'2025-01-24 13:16:49'),(84,'AddItem',3,13,20,'2025-01-24 14:53:00'),(85,'UpdateItem',1,6,2,'2025-01-24 15:03:08'),(86,'Delete',1,6,0,'2025-01-24 15:04:30');
/*!40000 ALTER TABLE `operation_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_method`
--

DROP TABLE IF EXISTS `payment_method`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_method` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `payment_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`payment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_method`
--

LOCK TABLES `payment_method` WRITE;
/*!40000 ALTER TABLE `payment_method` DISABLE KEYS */;
INSERT INTO `payment_method` VALUES (1,'Cash'),(2,'Contactless Payment (Apple Pay)'),(3,'Contactless Payment (Android Pay)'),(4,'Contactless Payment (Card)'),(5,'QR Code Payment (PayNow)'),(6,'QR Code Payment (PayLah)');
/*!40000 ALTER TABLE `payment_method` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status` (
  `status_id` int NOT NULL AUTO_INCREMENT,
  `status_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status`
--

LOCK TABLES `status` WRITE;
/*!40000 ALTER TABLE `status` DISABLE KEYS */;
INSERT INTO `status` VALUES (1,'Operational'),(2,'Out of Order'),(3,'Maintenance'),(4,'Decommissioned');
/*!40000 ALTER TABLE `status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vending_item`
--

DROP TABLE IF EXISTS `vending_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vending_item` (
  `vending_item_id` int NOT NULL,
  `vending_machine_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  PRIMARY KEY (`vending_item_id`),
  KEY `vending_machine_id_idx` (`vending_machine_id`),
  KEY `item_id_idx` (`item_id`),
  CONSTRAINT `item_id` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `vending_machine_id` FOREIGN KEY (`vending_machine_id`) REFERENCES `vending_machine` (`vending_machine_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vending_item`
--

LOCK TABLES `vending_item` WRITE;
/*!40000 ALTER TABLE `vending_item` DISABLE KEYS */;
INSERT INTO `vending_item` VALUES (4,1,4),(9,1,9),(10,1,10),(13,2,3),(14,2,4),(15,2,5),(16,2,6),(17,2,7),(18,2,8),(19,2,9),(20,2,10),(22,3,2),(25,3,5),(26,3,6),(27,3,7),(28,3,8),(29,3,9),(30,3,10),(31,4,1),(32,4,3),(34,4,5),(37,4,9),(38,4,10),(39,5,1),(42,5,5),(43,5,6),(44,5,8),(45,5,9),(46,5,10),(47,6,1),(48,6,3),(49,6,4),(50,6,5),(51,6,6),(52,6,8),(53,6,9),(54,6,10),(55,7,2),(56,7,4),(57,7,5),(58,7,6),(59,7,7),(60,7,9),(61,7,10),(62,8,2),(63,8,4),(64,8,5),(65,8,6),(66,8,7),(67,8,9),(68,8,10),(69,9,2),(70,9,4),(71,9,5),(72,9,6),(73,9,7),(74,9,9),(75,9,10),(76,10,1),(77,10,2),(79,10,4),(80,10,5),(81,10,6),(82,10,7),(83,10,8),(84,10,9),(85,10,10),(86,1,11),(87,3,11),(88,1,12),(89,4,2),(90,3,12),(91,3,1),(92,1,2),(93,3,4),(94,1,1),(95,3,13);
/*!40000 ALTER TABLE `vending_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vending_machine`
--

DROP TABLE IF EXISTS `vending_machine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vending_machine` (
  `vending_machine_id` int NOT NULL AUTO_INCREMENT,
  `location_id` int DEFAULT NULL,
  `vendor_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_id` int DEFAULT NULL,
  PRIMARY KEY (`vending_machine_id`),
  KEY `location_id_idx` (`location_id`),
  KEY `status_id_idx` (`status_id`),
  CONSTRAINT `location_id` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `status_id` FOREIGN KEY (`status_id`) REFERENCES `status` (`status_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vending_machine`
--

LOCK TABLES `vending_machine` WRITE;
/*!40000 ALTER TABLE `vending_machine` DISABLE KEYS */;
INSERT INTO `vending_machine` VALUES (1,1,'Machine Managers Pte Ltd',2),(2,2,'Machine Managers Pte Ltd',1),(3,3,'Machine Managers Pte Ltd',1),(4,4,'Machine Managers Pte Ltd',1),(5,5,'Machine Managers Pte Ltd',1),(6,6,'Amazing Snacks LLC',1),(7,7,'Amazing Snacks LLC',1),(8,8,'Amazing Snacks LLC',1),(9,9,'Amazing Snacks LLC',1),(10,10,'Amazing Snacks LLC',1);
/*!40000 ALTER TABLE `vending_machine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vending_payment`
--

DROP TABLE IF EXISTS `vending_payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vending_payment` (
  `vending_payment_id` int NOT NULL AUTO_INCREMENT,
  `vending_id` int DEFAULT NULL,
  `payment_id` int DEFAULT NULL,
  PRIMARY KEY (`vending_payment_id`),
  KEY `vending_id_idx` (`vending_id`),
  KEY `payment_id_idx` (`payment_id`),
  CONSTRAINT `payment_id` FOREIGN KEY (`payment_id`) REFERENCES `payment_method` (`payment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `vending_id` FOREIGN KEY (`vending_id`) REFERENCES `vending_machine` (`vending_machine_id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vending_payment`
--

LOCK TABLES `vending_payment` WRITE;
/*!40000 ALTER TABLE `vending_payment` DISABLE KEYS */;
INSERT INTO `vending_payment` VALUES (1,1,1),(2,1,2),(3,1,3),(4,1,4),(5,1,5),(6,2,1),(7,2,2),(8,2,3),(9,2,4),(10,2,5),(11,3,1),(12,4,2),(13,4,3),(14,4,4),(15,4,5),(16,5,1),(17,6,2),(18,6,3),(19,6,4),(20,6,5),(21,7,1),(22,7,2),(23,7,3),(24,7,4),(25,7,5),(26,8,1),(27,8,2),(28,8,3),(29,8,4),(30,8,5),(31,9,1),(32,10,2),(33,10,3),(34,10,4),(35,10,5);
/*!40000 ALTER TABLE `vending_payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'vending_machine'
--

--
-- Dumping routines for database 'vending_machine'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-24 15:57:43
