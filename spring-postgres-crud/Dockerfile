# ---- Build Stage ----
FROM eclipse-temurin:25-jdk-alpine AS builder

WORKDIR /app

COPY mvnw mvnw
COPY .mvn .mvn
COPY pom.xml ./
COPY src src

RUN chmod +x mvnw && ./mvnw package -DskipTests --no-transfer-progress

# ---- Run Stage ----
FROM eclipse-temurin:25-jre-alpine

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]