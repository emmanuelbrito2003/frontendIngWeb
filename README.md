# 🖥️ Sistema de Empleados - Frontend

Aplicación web desarrollada con Angular para la gestión de empleados con interfaces diferenciadas por rol.

## 🚀 Tecnologías

- **Angular 19** - Framework principal
- **TypeScript** - Lenguaje de programación
- **Bootstrap 5** - Framework CSS para componentes
- **RxJS** - Programación reactiva
- **Angular Router + Guards** - Navegación y protección de rutas

## ⚙️ Configuración Previa

### Requisitos

- **Node.js 18+**
- **Angular CLI 19+**
- **npm 8+**

### Instalación de Angular CLI

```bash
npm install -g @angular/cli@latest
```

## 🔧 Instalación y Ejecución

### 1. Clonar el proyecto

```bash
git clone https://github.com/emmanuelbrito2003/frontendIngWeb
cd empleados-frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar API URL

En `src/app/services/auth.service.ts` y `empleado.service.ts`:

```typescript
private readonly API_URL = 'http://localhost:8080/api';
```

### 4. Ejecutar aplicación

```bash
ng serve
```

La aplicación estará disponible en: **http://localhost:4200**

## 🧪 Ejecutar Pruebas

```bash
# Pruebas unitarias
ng test

# Pruebas end-to-end
ng e2e
```

## 🎯 Funcionalidades

### Para Administradores

- ✅ Dashboard con estadísticas
- ✅ Crear, editar y eliminar empleados
- ✅ Filtrar empleados por nombre, departamento o rol
- ✅ Gestión completa del sistema
- ✅ Visualización de métricas y reportes

### Para Empleados

- ✅ Ver perfil personal
- ✅ Editar información propia (nombre, teléfono)
- ✅ Cambiar contraseña
- ✅ Historial de cuenta
- ✅ Acceso a información limitada

## 👥 Usuarios de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Admin** | admin@empresa.com | admin123 |
| **Empleado** | empleado@empresa.com | empleado123 |

## 🏗️ Estructura del Proyecto

```
src/app/
├── components/         # Componentes de la aplicación
│   ├── login/         # Componente de login
│   ├── navbar/        # Barra de navegación
│   ├── admin-dashboard/    # Dashboard de admin
│   └── empleado-profile/   # Perfil de empleado
├── guards/            # Guards de autenticación
├── interceptors/      # Interceptors HTTP
├── models/           # Interfaces TypeScript
├── services/         # Servicios Angular
└── app.component.ts
```

## 🔐 Seguridad

- 🔒 **Guards de autenticación** por ruta
- 🛡️ **Interceptor JWT** automático
- ✅ **Validaciones de formularios** robustas
- 🔄 **Redirección automática** por rol
- 🔐 **Protección de rutas** basada en permisos

## 🎨 Estilos

- **Bootstrap 5** para componentes
- **CSS personalizado** para tema
- **Responsive design** completo
- **Iconos Bootstrap Icons**

## 📱 Responsive

La aplicación es completamente responsive y funciona en:

- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🔗 Dependencias Principales

```json
{
  "@angular/core": "^19.0.0",
  "@angular/common": "^19.0.0",
  "@angular/router": "^19.0.0",
  "bootstrap": "^5.3.0",
  "rxjs": "~7.8.0"
}
```

## 🚀 Comandos Útiles

### Desarrollo

```bash
# Servidor de desarrollo
ng serve

# Servidor con configuración específica
ng serve --host 0.0.0.0 --port 4200

# Build de desarrollo
ng build

# Build de producción
ng build --configuration production
```

### Generación de Código

```bash
# Generar componente
ng generate component nombre-componente

# Generar servicio
ng generate service nombre-servicio

# Generar guard
ng generate guard nombre-guard

# Generar interceptor
ng generate interceptor nombre-interceptor
```

### Testing

```bash
# Ejecutar tests en modo watch
ng test

# Ejecutar tests con coverage
ng test --code-coverage

# Ejecutar tests e2e
ng e2e
```

## 📊 Características Técnicas

### Performance
- ⚡ **Lazy loading** de módulos
- 🎯 **Tree shaking** automático
- 📦 **Bundle optimization**
- 🚀 **AOT compilation**

### Desarrollo
- 🔍 **Hot reload** automático
- 🐛 **Source maps** para debugging
- 📝 **TypeScript** para type safety
- 🎨 **ESLint** para calidad de código

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes alguna pregunta o problema:

- 📧 **Email**: soporte@empresa.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/tu-usuario/empleados-frontend/issues)
- 📚 **Documentación**: [Wiki del proyecto](https://github.com/tu-usuario/empleados-frontend/wiki)

---

**Desarrollado con ❤️ usando Angular 19**
