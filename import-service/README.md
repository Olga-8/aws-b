hw5
Создан новый сервис import-service на том же уровне, что и Product Service, с собственным стеком AWS CDK. 
В консоли AWS создана и настроена новая корзину S3 с папкой с именем uploaded.


 HTTP GET https://czhq2bhbmi.execute-api.eu-west-1.amazonaws.com/dev/import?name=example.csv
     load->    https://bukethw5.s3.eu-west-1.amazonaws.com/uploaded/catalog_books_10.csv                              
functions:
1 importProductsFile: import-service-dev-importProductsFile (18MB)                                                                                
2 importFileParser: import-service-dev-importFileParser (18 MB)       


