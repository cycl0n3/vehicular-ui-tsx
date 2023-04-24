const prod = {
    url: {
        API_BASE_URL: 'https://myapp.herokuapp.com',
        API_VERSION: "v1",
        API: "api"
    }
}

const dev = {
    url: {
        API_BASE_URL: 'http://localhost:8080',
        API_VERSION: "v1",
        API: "api"
    }
}

export const config = process.env.NODE_ENV === 'development' ? dev : prod
