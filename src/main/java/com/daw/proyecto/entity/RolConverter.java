package com.daw.proyecto.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class RolConverter implements AttributeConverter<Rol, String> {

    @Override
    public String convertToDatabaseColumn(Rol rol) {
        return (rol == null) ? null : rol.name();
    }

    @Override
    public Rol convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) return null;
        // Primero intentamos mapear por nombre del enum (USER_ROLE / ADMIN_ROLE)
        try {
            return Rol.valueOf(dbData);
        } catch (IllegalArgumentException e) {
            // Si falla, usamos el método auxiliar que acepta 'cliente'/'admin' y case-insensitive
            return Rol.fromValor(dbData);
        }
    }
}
