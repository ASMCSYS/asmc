# ASMC Next - Architecture Overview

Comprehensive architectural documentation for the ASMC Next.js frontend application, including system design, component architecture, data flow, and integration patterns.

## 📋 Table of Contents

-   [System Architecture](#system-architecture)
-   [Component Architecture](#component-architecture)
-   [Data Flow](#data-flow)
-   [State Management](#state-management)
-   [API Integration](#api-integration)
-   [Routing Architecture](#routing-architecture)
-   [Performance Architecture](#performance-architecture)
-   [Security Architecture](#security-architecture)
-   [Deployment Architecture](#deployment-architecture)

## 🏗️ System Architecture

### High-Level Architecture

![High-Level Architecture](https://ik.imagekit.io/hl37bqgg7/release-screenshots/Screenshot%202025-09-13%20at%203.57.18%E2%80%AFPM.png)

### Technology Stack Architecture

![Technology Stack Architecture](https://ik.imagekit.io/hl37bqgg7/release-screenshots/Screenshot%202025-09-13%20at%203.58.49%E2%80%AFPM.png)

## 🧩 Component Architecture

### Component Hierarchy

![Component Hierarchy](https://ik.imagekit.io/hl37bqgg7/release-screenshots/Screenshot%202025-09-13%20at%203.58.12%E2%80%AFPM.png)

### Component Pattern

#### Container-Component Pattern

```javascript
// Container Component (Redux Connected)
const EventsContainer = ({ events, loading, error, fetchEvents, navigate }) => {
    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleEventClick = (eventId) => {
        navigate(`/events/${eventId}`);
    };

    return (
        <EventsList
            events={events}
            loading={loading}
            error={error}
            onEventClick={handleEventClick}
        />
    );
};

// Presentation Component (Pure)
const EventsList = ({ events, loading, error, onEventClick }) => {
    if (loading) return <Loader />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <div className="events-list">
            {events.map((event) => (
                <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => onEventClick(event.id)}
                />
            ))}
        </div>
    );
};
```

## 🔄 Data Flow

### Application Data Flow

![Application Data Flow](https://ik.imagekit.io/hl37bqgg7/release-screenshots/Screenshot%202025-09-13%20at%204.03.52%E2%80%AFPM.png)

### State Management Flow

![State Management Flow](https://ik.imagekit.io/hl37bqgg7/release-screenshots/Screenshot%202025-09-13%20at%204.10.08%E2%80%AFPM.png)

## 🔄 State Management

### Redux Architecture

![Redux Architecture](https://ik.imagekit.io/hl37bqgg7/release-screenshots/Screenshot%202025-09-13%20at%203.59.34%E2%80%AFPM.png)

### State Structure

```javascript
// Root State Structure
{
    auth: {
        isAuthenticated: boolean,
        user: User | null,
        token: string | null,
        loading: boolean,
        error: string | null
    },
    common: {
        theme: 'light' | 'dark',
        language: string,
        notifications: Notification[],
        loading: boolean,
        modals: {
            login: boolean,
            register: boolean,
            payment: boolean
        }
    },
    masters: {
        categories: Category[],
        types: Type[],
        facilities: Facility[],
        loading: boolean
    },
    // RTK Query API States
    authApis: {
        queries: {},
        mutations: {},
        subscriptions: {}
    },
    commonApis: {
        queries: {},
        mutations: {},
        subscriptions: {}
    },
    mastersApis: {
        queries: {},
        mutations: {},
        subscriptions: {}
    }
}
```

## 🔌 API Integration

### API Layer Architecture

![API Layer Architecture](https://ik.imagekit.io/hl37bqgg7/release-screenshots/Screenshot%202025-09-13%20at%204.00.08%E2%80%AFPM.png)

### API Configuration

```javascript
// Axios Configuration
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getCookieData('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            removeCookieData('token');
            window.location.href = '/sign-in';
        }
        return Promise.reject(error);
    },
);
```

## 🛣️ Routing Architecture

### Next.js Pages Router

![Next.js Pages Router](https://ik.imagekit.io/hl37bqgg7/release-screenshots/Screenshot%202025-09-13%20at%204.04.50%E2%80%AFPM.png)

### Route Configuration

```javascript
// Dynamic Route Example
// pages/events/[event_id].js
import { useRouter } from 'next/router';
import { useGetEventQuery } from '@/redux/common/commonApis';

const EventDetails = () => {
    const router = useRouter();
    const { event_id } = router.query;

    const { data: event, isLoading, error } = useGetEventQuery(event_id);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading event</div>;
    if (!event) return <div>Event not found</div>;

    return (
        <div>
            <h1>{event.title}</h1>
            <p>{event.description}</p>
        </div>
    );
};

export default EventDetails;
```

## ⚡ Performance Architecture

### Performance Optimization

![Performance Optimization](https://ik.imagekit.io/hl37bqgg7/release-screenshots/Screenshot%202025-09-13%20at%204.01.52%E2%80%AFPM.png)

### Performance Strategies

#### 1. **Code Splitting**

```javascript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('../components/HeavyComponent'), {
    loading: () => <div>Loading...</div>,
    ssr: false,
});
```

#### 2. **Image Optimization**

```javascript
import Image from 'next/image';

<Image
    src="/images/hero.jpg"
    alt="Hero image"
    width={800}
    height={600}
    priority
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,..."
/>;
```

#### 3. **Cache Management**

```javascript
// RTK Query cache configuration
export const eventsApi = createApi({
    reducerPath: 'eventsApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Events'],
    endpoints: (builder) => ({
        getEvents: builder.query({
            query: () => 'events',
            providesTags: ['Events'],
            keepUnusedDataFor: 60, // 1 minute
        }),
    }),
});
```

## 🔒 Security Architecture

### Security Layers

![Security Layers](https://ik.imagekit.io/hl37bqgg7/release-screenshots/Screenshot%202025-09-13%20at%204.05.33%E2%80%AFPM.png)

### Security Implementation

#### 1. **Content Security Policy**

```javascript
// next.config.mjs
const nextConfig = {
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
                    },
                ],
            },
        ];
    },
};
```

#### 2. **Authentication Security**

```javascript
// Token management
const setCookieData = (key, value, days = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    document.cookie = `${key}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
};

const removeCookieData = (key) => {
    document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;secure;samesite=strict`;
};
```

## 🚀 Deployment Architecture

### Deployment Strategy

![Deployment Strategy](https://ik.imagekit.io/hl37bqgg7/release-screenshots/Screenshot%202025-09-13%20at%204.06.22%E2%80%AFPM.png)

### Deployment Configuration

#### 1. **PM2 Configuration**

```javascript
// ecosystem.config.js
module.exports = {
    apps: [
        {
            name: 'asmc-next',
            script: 'npm',
            args: 'start',
            instances: 'max',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
            error_file: './logs/err.log',
            out_file: './logs/out.log',
            log_file: './logs/combined.log',
            time: true,
        },
    ],
};
```

#### 2. **Nginx Configuration**

```nginx
server {
    listen 80;
    server_name asmcdae.in;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name asmcdae.in;

    ssl_certificate /etc/letsencrypt/live/asmcdae.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/asmcdae.in/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 Monitoring & Analytics

### Performance Monitoring

![Performance Monitoring](https://ik.imagekit.io/hl37bqgg7/release-screenshots/Screenshot%202025-09-13%20at%204.08.53%E2%80%AFPM.png)

### Monitoring Implementation

```javascript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
    // Send to analytics service
    console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

---

## 🎯 Architecture Benefits

### Scalability

-   **Component-based architecture** enables easy feature additions
-   **Redux state management** provides predictable state updates
-   **RTK Query caching** reduces server load and improves performance
-   **Next.js optimization** ensures fast page loads and SEO

### Maintainability

-   **Clear separation of concerns** between presentation and logic
-   **Consistent coding patterns** across the application
-   **Comprehensive documentation** for easy onboarding
-   **Type safety** with PropTypes and ESLint rules

### Performance

-   **Server-side rendering** for better SEO and initial load times
-   **Code splitting** for smaller bundle sizes
-   **Image optimization** for faster page loads
-   **Caching strategies** for improved user experience

### Security

-   **JWT authentication** for secure user sessions
-   **Input validation** to prevent XSS attacks
-   **HTTPS enforcement** for secure data transmission
-   **Content Security Policy** for additional protection

---

**Last Updated**: January 2025  
**Maintainer**: ASMC Development Team
