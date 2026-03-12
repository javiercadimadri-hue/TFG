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


## 1.1 Tipo de Proyecto

Se ha desarrollado una **aplicación web de gestión integral para gimnasios**, accesible desde navegador, que centraliza todos los procesos en una única plataforma digital.

## 1.2 Características del Proyecto

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


# 6. MANUAL DE USUARIO

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

# 7. EVALUACIÓN DEL PROYECTO

## 7.1 Procedimiento de Control

* Pruebas funcionales
* Validación de datos
* Control de roles
* Verificación de cálculos
* Control de stock

## 7.2 Indicadores de Calidad

* Tiempo de respuesta < 2 segundos
* 0 errores críticos
* Cálculo correcto de descuentos
* Seguridad validada

## 7.3 Documentación de Evaluación

* Plan de pruebas
* Casos documentados
* Resultados verificados
* Informe final

---

# 8. CONCLUSIÓN

El proyecto cumple con:

* Identificación de necesidades
* Diseño estructurado
* Planificación organizada
* Evaluación con indicadores
* Manual técnico completo
* Manual de usuario claro

Se trata de una solución digital completa, escalable y segura para la gestión moderna de un gimnasio.

