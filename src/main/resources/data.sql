-- Insertar usuarios con planes y fechas de expiración (usando INSERT IGNORE para evitar duplicados)
INSERT IGNORE INTO Usuarios (id_usuario, nombre, email, contrasena, teléfono, fecha_alta, rol, foto_filename, plan, fecha_expiracion_plan) VALUES
(100, 'Administrador', 'admin@ironfit.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '600123456', NOW(), 'ADMIN_ROLE', NULL, NULL, NULL);
-- (2, 'Super Administrador', 'superadmin@test.com', 'superadmin123', '600123457', NOW(), 'ADMIN_ROLE', NULL, NULL, NULL),
-- (3, 'Juan Pérez', 'juan@example.com', 'password123', '611111111', NOW(), 'USER_ROLE', NULL, 'Plan Basic', DATE_ADD(NOW(), INTERVAL 15 DAY)),
-- (4, 'María García', 'maria@example.com', 'password123', '622222222', NOW(), 'USER_ROLE', NULL, 'Fitness Total', DATE_ADD(NOW(), INTERVAL 20 DAY)),
-- (5, 'Carlos López', 'carlos@example.com', 'password123', '633333333', NOW(), 'USER_ROLE', NULL, NULL, NULL),
-- (6, 'Ana Martínez', 'ana@example.com', 'password123', '644444444', NOW(), 'USER_ROLE', NULL, NULL, NULL),
-- (7, 'Roberto Sánchez', 'roberto@example.com', 'password123', '655555555', NOW(), 'USER_ROLE', NULL, NULL, NULL),
-- (8, 'Tercer Admin', 'admin3@test.com', 'admin123', '600123458', NOW(), 'ADMIN_ROLE', NULL, NULL, NULL);

-- Insertar 10 productos (usando INSERT IGNORE para evitar duplicados)
-- Si ya existen con estos IDs, no hace nada
-- INSERT IGNORE INTO Productos (id_producto, nombre, descripcion, precio, stock, categoria, imagen) VALUES
-- (1, 'Mancuernas Ajustables 10kg', 'Juego de mancuernas ajustables de 10kg, excelentes para entrenamiento en casa o gym', 45.99, 15, 'Pesas', 'https://images.unsplash.com/photo-1538805060514-97d3aa1f57d7?w=300&h=300&fit=crop'),
-- (2, 'Colchoneta Yoga Premium', 'Colchoneta de yoga de alta densidad, antideslizante y resistente al sudor', 29.99, 25, 'Accesorios', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=300&fit=crop'),
-- (3, 'Banda Elástica Resistencia', 'Set de 5 bandas elásticas de diferentes resistencias para entrenamiento', 19.99, 40, 'Accesorios', 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=300&h=300&fit=crop'),
-- (4, 'Barra de Dominadas', 'Barra de acero para dominadas, ajustable para diferentes puertas', 64.99, 8, 'Barras', 'https://images.unsplash.com/photo-1574680178050-55c6a6be0fe0?w=300&h=300&fit=crop'),
-- (5, 'Kettlebell 16kg', 'Kettlebell de hierro fundido de 16kg, perfecto para entrenamientos funcionales', 54.99, 12, 'Pesas', 'https://images.unsplash.com/photo-1552072092-74c88496fda3?w=300&h=300&fit=crop'),
-- (6, 'Mochila de Gimnasio', 'Mochila deportiva con múltiples compartimentos, resistente al agua', 39.99, 30, 'Ropa', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'),
-- (7, 'Botella de Agua Deportiva', 'Botella térmica de 1 litro, mantiene bebidas frías 24h o calientes 12h', 24.99, 50, 'Accesorios', 'https://images.unsplash.com/photo-1602143407151-7e36dd5f5a0e?w=300&h=300&fit=crop'),
-- (8, 'Cinturón de Pesas', 'Cinturón de pesas para dominadas y fondos, capacidad hasta 50kg', 34.99, 18, 'Accesorios', 'https://images.unsplash.com/photo-1539571696357-5a69c006ae1f?w=300&h=300&fit=crop'),
-- (9, 'Cinta de Correr Plegable', 'Cinta de correr eléctrica, pantalla digital, superficie de 140x50cm', 299.99, 3, 'Máquinas', 'https://images.unsplash.com/photo-1521575107034-e3fb11b3a6e0?w=300&h=300&fit=crop'),
-- (10, 'Monitor Frecuencia Cardíaca', 'Reloj deportivo con medidor de frecuencia cardíaca y GPS', 89.99, 20, 'Tecnología', 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=300&fit=crop'),
-- (11, 'Dumbbell 30kg', 'Pesa hexagonal de 30kg, ideal para press de banca', 75.50, 10, 'Pesas', 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=300&h=300&fit=crop'),
-- (12, 'Cuerda de Saltar Velocidad', 'Cuerda ajustable con rodamientos para entrenamiento de velocidad', 15.99, 35, 'Accesorios', 'https://images.unsplash.com/photo-1574680178050-55c6a6be0fe0?w=300&h=300&fit=crop'),
-- (13, 'Camiseta Deportiva Premium', 'Camiseta anti-sudor, tejido transpirable, disponible en varios colores', 22.99, 60, 'Ropa', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop'),
-- (14, 'Pantalones Cortos Deportivos', 'Pantalones cortos deportivos con bolsillos, material ligero', 34.99, 45, 'Ropa', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop'),
-- (15, 'Zapatillas Running Pro', 'Zapatillas deportivas de última generación con amortiguación superior', 129.99, 20, 'Calzado', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop');

-- -- Insertar Planes como Productos Virtuales
-- INSERT IGNORE INTO Productos (id_producto, nombre, descripcion, precio, stock, categoria, imagen) VALUES
-- (101, 'Plan Basic', 'Acceso completo a sala de musculación y cardio en horario de mañana (7:00 a 14:00).', 19.99, 999, 'Plan', 'img/planBasic.webp'),
-- (102, 'Fitness Total', 'Entrena sin límites a cualquier hora. Acceso total a maquinaria de última generación.', 29.99, 999, 'Plan', 'img/planTotal.jpg'),
-- (103, 'Iron Performance', 'Para atletas: incluye acceso a clases dirigidas de Crossfit y zona de Boxeo.', 44.90, 999, 'Plan', 'img/planPerformance.jpg'),
-- (104, 'Wellness & Relax', 'Enfocado en tu bienestar: Yoga, Pilates, acceso a piscina y zona de sauna.', 35.00, 999, 'Plan', 'img/yoga.jpg'),
-- (105, 'Premium VIP', 'Entrenador personal, plan nutricional a medida y todas las clases incluidas.', 89.99, 999, 'Plan', 'img/planVip.jpg'),
-- (106, 'Plan Dúo', 'Entrenar acompañado es mejor. Cuota compartida para dos personas sin restricciones.', 49.90, 999, 'Plan', 'img/planDuo.jpg');


