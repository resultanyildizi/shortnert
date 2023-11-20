package main

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgconn"
)

var LinkNotFoundError = errors.New("Link not found")

func GetLinkByKey(ctx *gin.Context, dbservice *DatabaseService) {
	key := ctx.Param("key")
	result, err := dbservice.GetLinkByKey(key)

	if err != nil {
		ctx.IndentedJSON(http.StatusNotFound, gin.H{"error": "Link not found"})
	}

	linkRes := LinkRes{Id: result.Id, Key: result.Key, Url: result.Url}

	ctx.IndentedJSON(http.StatusOK, linkRes)
}

func RemoveLinkById(ctx *gin.Context, dbservice *DatabaseService) {
	// int id
	id, err := strconv.Atoi(ctx.Param("id"))

	if err != nil {
		ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Id is not valid"})
	}

	err = dbservice.RemoveLinkById(id)

	if err != nil {
		if errors.Is(err, LinkNotFoundError) {
			ctx.IndentedJSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else {
			ctx.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
	}

	ctx.IndentedJSON(http.StatusNoContent, gin.H{})
}

func AddLink(ctx *gin.Context, dbservice *DatabaseService) {
	var linkReq LinkReq

	// ShouldBindJSON reads the JSON body and binds it to the provided struct
	if err := ctx.ShouldBindJSON(&linkReq); err != nil {
		// Handle the error (e.g., invalid JSON format)
		ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fmt.Println(linkReq.Key)

	result, err := dbservice.AddLink(linkReq.Key, linkReq.Url)

	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) {
			fmt.Println(pgErr.Code) // => 42601

			if pgErr.Code == "23505" {
				ctx.IndentedJSON(http.StatusConflict, gin.H{"error": "Key already exists"})
				return
			} else if pgErr.Code == "23514" {
				ctx.IndentedJSON(http.StatusBadRequest, gin.H{"error": "Request body is not valid"})
				return
			}
		}
		ctx.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	linkRes := LinkRes{Id: result.Id, Key: result.Key, Url: result.Url}

	// Respond with a success message
	ctx.IndentedJSON(http.StatusCreated, linkRes)
}
