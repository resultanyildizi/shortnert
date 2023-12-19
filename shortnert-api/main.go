package main

import (
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	dbservice, err := NewDatabaseService(os.Getenv("DATABASE_URL"))
	if err != nil {
		panic("Database connection couldn't established " + err.Error())
	}
	defer dbservice.Close()

	router := gin.Default()
	// Enable CORS middleware
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "UPDATE"}
	router.Use(cors.New(config))

	basePath := "/v1"

	router.GET(basePath+"/links/:alias", func(ctx *gin.Context) { GetLinkByAlias(ctx, dbservice) })
	router.GET(basePath+"/links", func(ctx *gin.Context) { GetLatestLinks(ctx, dbservice) })
	router.POST(basePath+"/links", func(ctx *gin.Context) { AddLink(ctx, dbservice) })
	router.DELETE(basePath+"/links/:id", func(ctx *gin.Context) { RemoveLinkById(ctx, dbservice) })
	router.Run(os.Getenv("API_URL"))
}
