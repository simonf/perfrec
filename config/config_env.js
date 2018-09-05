module.exports = {
  development: {
    mock: true,
    SERVICE_API: 'http://amsnov02:8080/service-inventory/api/connection/',
    REQUEST_GET_API: 'http://amsnov02:8080/request-api/api/requests/',
    REQUEST_POST_API: 'http://amsnov02:8080/request-api/api/requests/updateconnection/'
  },
  test: {
    mock: false,
    SERVICE_API: 'http://amsnov02:8080/service-inventory/api/connection/',
    REQUEST_GET_API: 'http://amsnov02:8080/request-api/api/requests/',
    REQUEST_POST_API: 'http://amsnov02:8080/request-api/api/requests/updateconnection/'
  },
  production: {
    mock: false,
    SERVICE_API: 'http://londcp12:8330/service-inventory/api/connection/',
    REQUEST_GET_API: 'http://londcp12:8330/request-api/api/requests/',
    REQUEST_POST_API: 'http://londcp12:8330/request-api/api/requests/updateconnection/'
  }
}
