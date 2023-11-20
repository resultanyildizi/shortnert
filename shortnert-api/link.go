package main

type LinkDbo struct {
	Id  int    `json:"id"`
	Key string `json:"key"`
	Url string `json:"url"`
}

type LinkReq struct {
	Key string `json:"key"`
	Url string `json:"url"`
}

type LinkRes struct {
	Id  int    `json:"id"`
	Key string `json:"key"`
	Url string `json:"url"`
}
