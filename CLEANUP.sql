-- ============================================
-- SCRIPT PARA LIMPIAR Y RECARGAR PRODUCTOS
-- ============================================

USE gimnasio_db;

-- 1. Eliminar los 2 productos viejos
DELETE FROM Productos WHERE id_producto IN (1, 2);

-- 2. ó si quieres eliminar TODO (cuidado):
-- DELETE FROM Productos;
-- ALTER TABLE Productos AUTO_INCREMENT = 1;

-- 3. Insertar los 10 nuevos productos
INSERT IGNORE INTO Productos (id_producto, nombre, descripcion, precio, stock, categoria, imagen) VALUES
(1, 'Mancuernas Ajustables 10kg', 'Juego de mancuernas ajustables de 10kg, excelentes para entrenamiento en casa o gym', 45.99, 15, 'Pesas', 'https://images.unsplash.com/photo-1538805060514-97d3aa1f57d7?w=300&h=300&fit=crop'),
(2, 'Colchoneta Yoga Premium', 'Colchoneta de yoga de alta densidad, antideslizante y resistente al sudor', 29.99, 25, 'Accesorios', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=300&fit=crop'),
(3, 'Banda Elástica Resistencia', 'Set de 5 bandas elásticas de diferentes resistencias para entrenamiento', 19.99, 40, 'Accesorios', 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=300&h=300&fit=crop'),
(4, 'Barra de Dominadas', 'Barra de acero para dominadas, ajustable para diferentes puertas', 64.99, 8, 'Barras', 'https://images.unsplash.com/photo-1574680178050-55c6a6be0fe0?w=300&h=300&fit=crop'),
(5, 'Kettlebell 16kg', 'Kettlebell de hierro fundido de 16kg, perfecto para entrenamientos funcionales', 54.99, 12, 'Pesas', 'https://images.unsplash.com/photo-1552072092-74c88496fda3?w=300&h=300&fit=crop'),
(6, 'Mochila de Gimnasio', 'Mochila deportiva con múltiples compartimentos, resistente al agua', 39.99, 30, 'Ropa', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'),
(7, 'Botella de Agua Deportiva', 'Botella térmica de 1 litro, mantiene bebidas frías 24h o calientes 12h', 24.99, 50, 'Accesorios', 'https://images.unsplash.com/photo-1602143407151-7e36dd5f5a0e?w=300&h=300&fit=crop'),
(8, 'Cinturón de Pesas', 'Cinturón de pesas para dominadas y fondos, capacidad hasta 50kg', 34.99, 18, 'Accesorios', 'https://images.unsplash.com/photo-1539571696357-5a69c006ae1f?w=300&h=300&fit=crop'),
(9, 'Cinta de Correr Plegable', 'Cinta de correr eléctrica, pantalla digital, superficie de 140x50cm', 299.99, 3, 'Máquinas', 'https://images.unsplash.com/photo-1521575107034-e3fb11b3a6e0?w=300&h=300&fit=crop'),
(10, 'Monitor Frecuencia Cardíaca', 'Reloj deportivo con medidor de frecuencia cardíaca y GPS', 89.99, 20, 'Tecnología', 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=300&fit=crop');

-- 4. Verificar que funcionó
SELECT COUNT(*) as total_productos FROM Productos;
SELECT * FROM Productos;

