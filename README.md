# PLATAFORMA WEB DE GESTIÓN DE GIMNASIO

Aplicación web desarrollada con **Java 17 + Spring Boot + MySQL**, orientada a la gestión integral de un gimnasio.

Permite:

* Gestión de usuarios y roles
* Contratación de planes
* Aplicación de promociones
* Tienda online con carrito
* Gestión de pedidos
* Reserva de profesionales
* Panel de administración
* Iniciar sesión
* Registrarse
* Subir foto de perfil y visualizarla
* Añadir productos al carrito, ver carrito y realizar pedidos
* Como administrador: ver la lista de usuarios y añadir productos

---

# 1. IDENTIFICACIÓN DE NECESIDADES

## 1.1 Necesidades del Sector

Tras analizar el sector fitness y gimnasios, se identificaron las siguientes necesidades principales:

* Digitalización de la gestión de socios
* Automatización de suscripciones
* Venta online de productos deportivos
* Aplicación automática de promociones
* Reserva online de entrenadores y profesionales
* Control de stock en tiempo real
* Seguridad en accesos según rol
* Reducción de gestión manual administrativa

## 1.2 Tipo de Proyecto

Se ha desarrollado una **aplicación web de gestión integral para gimnasios**, accesible desde navegador, que centraliza todos los procesos en una única plataforma digital.

## 1.3 Características del Proyecto

* Arquitectura en capas (Controller → Service → Repository)
* Persistencia con Spring Data JPA
* Base de datos relacional MySQL
* Frontend dinámico con Thymeleaf
* Diseño responsive con Bootstrap
* Control de roles (ADMIN / USER)
* Validación automática de formularios
* Cálculo automático de descuentos
* Actualización automática de stock
* Subida y visualización de foto de perfil
* Separación clara entre lógica y presentación

## 1.4 Guion de Trabajo

1. Análisis del sector
2. Identificación de necesidades
3. Diseño de base de datos
4. Diseño de arquitectura
5. Desarrollo backend
6. Desarrollo frontend
7. Implementación de seguridad
8. Plan de pruebas
9. Documentación final

---

# 2. DISEÑO DEL PROYECTO

## 2.1 Fases del Proyecto

1. Análisis
2. Diseño
3. Desarrollo
4. Pruebas
5. Implementación
6. Evaluación

## 2.2 Objetivos

* Digitalizar la gestión del gimnasio
* Mejorar la experiencia del usuario
* Automatizar procesos manuales
* Garantizar seguridad y control de datos
* Permitir escalabilidad futura
* Optimizar la gestión administrativa

## 2.3 Recursos Necesarios

### Recursos Humanos

* 3 desarrolladores

### Recursos Técnicos

* Java 17
* Spring Boot
* Maven
* MySQL
* Thymeleaf
* Bootstrap
* IDE (IntelliJ / Eclipse / VSCode)
* Servidor local (Tomcat embebido)

## 2.4 Documentación Técnica Prevista

* Manual de instalación
* Manual de usuario
* Plan de pruebas
* Casos de prueba detallados
* Documentación de base de datos
* Evaluación final del sistema

## 2.5 Aspectos de Calidad

* Separación por capas
* Código modular
* Validación de datos
* Control de excepciones
* Seguridad por roles
* Pruebas funcionales
* Pruebas de integración

---

# 3. PLANIFICACIÓN

## 3.1 Organización de Actividades

| Fase | Actividad              |
| ---- | ---------------------- |
| 1    | Análisis de requisitos |
| 2    | Diseño base de datos   |
| 3    | Desarrollo backend     |
| 4    | Desarrollo frontend    |
| 5    | Seguridad              |
| 6    | Testing                |
| 7    | Documentación          |

## 3.2 Recursos Logísticos

* Equipos informáticos
* Servidor local
* Base de datos MySQL
* Control de versiones (Git)

## 3.3 Presupuesto Estimado

| Concepto       | Coste Aproximado   |
| -------------- | ------------------ |
| Desarrollo     | Proyecto académico |
| Software       | Open Source        |
| Hosting futuro | 100–200€/año       |

## 3.4 Documentación para la Implementación

* Configuración técnica
* Script base de datos
* Configuración application.properties
* Guía de ejecución
* Guía de despliegue

---

# 4. ARQUITECTURA DEL SISTEMA

## 4.1 Flujo General

```
Usuario → Interfaz Web → Controller → Service → Repository → Base de Datos
```

## 4.2 Estructura del Proyecto

```
src/
 ├── controller/
 ├── service/
 ├── repository/
 ├── entity/
 ├── config/
 ├── templates/
 └── static/
```

---

# 5. BASE DE DATOS

## 5.1 Tablas Principales

* usuarios
* planes
* promociones
* suscripciones
* productos
* pedidos
* detalle_pedido
* profesionales

## 5.2 Creación de Base de Datos

```sql
CREATE DATABASE gimnasio;
USE gimnasio;
```

Las tablas se generan automáticamente con:

```properties
spring.jpa.hibernate.ddl-auto=update
```

---

# 6. MANUAL DE INSTALACIÓN Y CONFIGURACIÓN

## 6.1 Requisitos Previos

* Java 17 o superior
* Maven
* MySQL Server
* IDE compatible

Comprobación:

```bash
java -version
mvn -version
mysql --version
```

## 6.2 Instalación Paso a Paso

### 1. Clonar el Proyecto

```bash
git clone https://github.com/tu-repositorio/gimnasio.git
cd gimnasio
```

### 2. Crear Base de Datos

```bash
mysql -u root -p
```

```sql
CREATE DATABASE gimnasio;
```

### 3. Configurar application.properties

Ruta:

```
src/main/resources/application.properties
```

Contenido:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gimnasio
spring.datasource.username=root
spring.datasource.password=TU_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8080
```

### 4. Compilar Proyecto

```bash
mvn clean install
```

### 5. Ejecutar Proyecto

Desde IDE:

Ejecutar `Application.java`

O desde consola:

```bash
mvn spring-boot:run
```

### 6. Acceder a la Aplicación

```
http://localhost:8080
```

---

# 7. DESPLIEGUE EN PRODUCCIÓN

## Generar .jar

```bash
mvn clean package
```

Archivo generado:

```
target/gimnasio-0.0.1-SNAPSHOT.jar
```

Ejecutar:

```bash
java -jar target/gimnasio-0.0.1-SNAPSHOT.jar
```

Recomendaciones:

* Configurar base de datos remota
* Cambiar credenciales
* Habilitar HTTPS
* Usar servidor Linux

---

# 8. GUÍA PARA PROGRAMADORES Y SOPORTE

## Arquitectura

* Controller → Peticiones HTTP
* Service → Lógica de negocio
* Repository → Acceso a datos
* Entity → Tablas BD

## Seguridad

* Roles: ROLE_USER, ROLE_ADMIN
* Protección de rutas
* Validación de formularios
* Control de sesiones

---

# 9. MANUAL DE USUARIO

## Registro

1. Acceder a la web
2. Pulsar "Registrarse"
3. Introducir datos
4. Confirmar registro

## Inicio de Sesión

1. Introducir email y contraseña
2. Pulsar "Iniciar sesión"

## Subir Foto de Perfil

1. Acceder a perfil
2. Subir imagen
3. Visualizar foto

## Contratar Plan

1. Ir a "Planes"
2. Seleccionar plan
3. Pulsar "Inscribirse"
4. Confirmar

## Comprar Producto

1. Ir a "Tienda"
2. Añadir productos al carrito
3. Ver carrito
4. Confirmar pedido

## Reservar Profesional

1. Ir a "Profesionales"
2. Seleccionar profesional
3. Elegir fecha
4. Confirmar reserva

## Área Personal

* Ver suscripciones
* Ver historial de pedidos
* Editar perfil

## Funcionalidades Administrador

* Ver lista de usuarios
* Añadir productos al catálogo

---

# 10. EVALUACIÓN DEL PROYECTO

## 10.1 Procedimiento de Control

* Pruebas funcionales
* Validación de datos
* Control de roles
* Verificación de cálculos
* Control de stock

## 10.2 Indicadores de Calidad

* Tiempo de respuesta < 2 segundos
* 0 errores críticos
* Cálculo correcto de descuentos
* Seguridad validada

## 10.3 Documentación de Evaluación

* Plan de pruebas
* Casos documentados
* Resultados verificados
* Informe final

---

# 11. GLOSARIO DE TÉRMINOS

Backend: Parte lógica del sistema
Frontend: Parte visual
Spring Boot: Framework Java
JPA: Persistencia de datos
CRUD: Crear, Leer, Actualizar, Eliminar
Entidad: Representación de tabla
Repositorio: Acceso a datos
Servicio: Lógica de negocio
Controlador: Gestión de peticiones
Rol: Nivel de permisos

---

# 12. CONCLUSIÓN

El proyecto cumple con:

* Identificación de necesidades
* Diseño estructurado
* Planificación organizada
* Evaluación con indicadores
* Manual técnico completo
* Manual de usuario claro

Se trata de una solución digital completa, escalable y segura para la gestión moderna de un gimnasio.

