package com.daw.proyecto.entity;

import com.fasterxml.jackson.annotation.JsonCreator; // <--- IMPORTA ESTO
import com.fasterxml.jackson.annotation.JsonValue;

public enum Rol {
    USER_ROLE("cliente"),
    ADMIN_ROLE("admin");

    private final String valor;

    Rol(String valor) {
        this.valor = valor;
    }

    @JsonValue
    public String getValor() {
        return valor;
    }

    /**
     * @JsonCreator le dice a Spring: "Cuando recibas un texto (JSON),
     * usa este método para buscar a qué Enum corresponde".
     */
    @JsonCreator 
    public static Rol fromValor(String valor) {
        // Si el valor viene nulo o vacío, devolvemos null o el por defecto
        if (valor == null || valor.trim().isEmpty()) {
            return USER_ROLE; // O return null, según prefieras
        }

        for (Rol rol : Rol.values()) {
            // Compara ignorando mayúsculas ("CLIENTE" == "cliente")
            if (rol.valor.equalsIgnoreCase(valor)) {
                return rol;
            }
            // TAMBIÉN COMPROBAR EL NOMBRE REAL POR SI ACASO
            // Esto permite que funcione si envían "cliente" O "USER_ROLE"
            if (rol.name().equalsIgnoreCase(valor)) {
                return rol;
            }
        }
        // Si no encuentra nada, devuelve el rol por defecto o lanza excepción
        return USER_ROLE; 
        // O: throw new IllegalArgumentException("Rol no válido: " + valor);
    }
}