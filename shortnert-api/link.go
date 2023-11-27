package main

type LinkDbo struct {
	Id    int    `json:"id"`
	Alias string `json:"alias"`
	Url   string `json:"url"`
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
