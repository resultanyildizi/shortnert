package main

import "time"

type LinkDbo struct {
	Id        int       `json:"id"`
	Alias     string    `json:"alias"`
	Url       string    `json:"url"`
	CreatedAt time.Time `json:"created_at"`
}

type LinkReq struct {
	Alias string `json:"alias"`
	Url   string `json:"url"`
}

type LinkRes struct {
	Id    int    `json:"id"`
	Alias string `json:"alias"`
	Url   string `json:"url"`
}
