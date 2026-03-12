package com.daw.proyecto.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        // Creamos los filtros
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/").permitAll()
                .requestMatchers("/usuarios/registro").permitAll()
                .requestMatchers("/usuarios/login").permitAll()
                .requestMatchers("/usuarios/procesarLogin").permitAll()
                .requestMatchers("/api/usuarios/registro").permitAll()
                .requestMatchers("/api/usuarios/login").permitAll()
                .requestMatchers("/api/usuarios/*/foto").permitAll()
                .requestMatchers("/css/**", "/js/**", "/images/**", "/static/**", "/fragments/**").permitAll()
                .anyRequest().permitAll()
        )
        .csrf(csrf -> csrf.disable())
        .formLogin(form -> form.disable())
        .logout(logout -> logout.disable())
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}

