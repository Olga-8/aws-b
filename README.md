// /shop - POST request should have  headers: "Content-Type": "application/json"


endpoints:                                                                                                                                  
  GET - https://ujnkt4292f.execute-api.eu-west-1.amazonaws.com/dev/products
  GET - https://ujnkt4292f.execute-api.eu-west-1.amazonaws.com/dev/products/{id}
  POST - https://ujnkt4292f.execute-api.eu-west-1.amazonaws.com/dev/products
  {
        "id": "123",
        "title": "title",
        "description": "description",
        "price": 100,
        "count": 10
}


functions:
  getProductsList: product-service-dev-getProductsList (17 MB)                                                                              
  getProductById: product-service-dev-getProductById (17 MB)
  createProduct: product-service-dev-createProduct (17 MB)
