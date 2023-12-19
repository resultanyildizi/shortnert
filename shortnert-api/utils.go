package main

func LinkResFromLinkDbo(linkDbo *LinkDbo) LinkRes {
	//createdAtString := linkDbo.CreatedAt.UTC().Format("2006-01-02T15:04:05Z")
	return LinkRes{Id: linkDbo.Id, Alias: linkDbo.Alias, Url: linkDbo.Url}
}
