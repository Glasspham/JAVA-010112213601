package com.project.codebasespringjpa.configuration.security;

import com.project.codebasespringjpa.configuration.security.jwtConfig.JwtAuthenticationFilter;
import com.project.codebasespringjpa.configuration.security.jwtConfig.UnauthenErr;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Security {
    @Autowired
    UnauthenErr unauthenErr;

    private static final String[] ALLOWED_ORIGINS = {
            "http://localhost:3000",
            "http://127.0.0.1:3000"
    };

    private static final String[] ALLOWED_ORIGIN_PATTERNS = {
            "http://192.168.*.*:3000",
            "http://10.*.*.*:3000",
            "http://172.16.*.*:3000"
    };

    private static final String[] SWAGGER_WHITELIST = {
            "/auth/login", "/auth/register",
            "/files/**",
            "/swagger-ui/**", "/v3/api-docs/**",
            "/avatar*", // Thêm đường dẫn avatar
            "/*.avif", "/*.jpg", "/*.jpeg", "/*.png", "/*.gif", // Thêm các định dạng ảnh phổ biến
            "/*.JPG", "/*.JPEG", "/*.PNG",
            "/*.mp4", "/*.mp3", "/*.mkv", // Thêm các định dạng âm thanh phổ biến
            "/*.MP4", "/*.MP3", "/*.MKV"
    };

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    // ---cors
    @Bean
    public WebMvcConfigurer configurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(ALLOWED_ORIGINS)
                        .allowedOriginPatterns(ALLOWED_ORIGIN_PATTERNS)
                        .allowCredentials(true)
                        .allowedMethods("GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(cfrs -> cfrs.disable());
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
        http.authorizeHttpRequests(auth -> auth
                // Public endpoints - không cần authentication
                .requestMatchers(SWAGGER_WHITELIST).permitAll()
                // Tất cả endpoints khác cần authentication
                .anyRequest().authenticated())
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(unauthenErr))
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(ALLOWED_ORIGINS));
        configuration.setAllowedOriginPatterns(Arrays.asList(ALLOWED_ORIGIN_PATTERNS));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
