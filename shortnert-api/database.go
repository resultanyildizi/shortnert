package main

import (
	"context"

	"github.com/jackc/pgx/v4/pgxpool"
)

type DatabaseService struct {
	dbPool *pgxpool.Pool
}

func NewDatabaseService(connection string) (*DatabaseService, error) {
	pool, err := pgxpool.Connect(context.Background(), connection)
	if err != nil {
		return nil, err
	}

	return &DatabaseService{
		dbPool: pool,
	}, nil
}

func (db *DatabaseService) Close() {
	db.dbPool.Close()
}

func (db *DatabaseService) GetLinkByAlias(alias string) (*LinkDbo, error) {
	query := `
		SELECT id, url, alias, created_at
			FROM public.links
			WHERE alias = $1 AND deleted_at IS NULL;
	`
	var link LinkDbo
	err := db.dbPool.QueryRow(context.Background(), query, alias).Scan(&link.Id, &link.Url, &link.Alias, &link.CreatedAt)

	if err != nil {
		return nil, err
	}
	return &link, nil
}

func (db *DatabaseService) AddLink(alias string, url string) (*LinkDbo, error) {
	query := `
		INSERT INTO public.links(alias, url, created_at)
			VALUES ($1, $2, NOW())
			RETURNING id, alias, url, created_at;
	`
	var link LinkDbo
	err := db.dbPool.QueryRow(context.Background(), query, alias, url).Scan(&link.Id, &link.Alias, &link.Url, &link.CreatedAt)

	if err != nil {
		return nil, err
	}

	return &link, nil
}

func (db *DatabaseService) RemoveLinkById(id int) error {

	query := `
		UPDATE public.links
			SET deleted_at = NOW()
			WHERE deleted_at IS NULL AND id = $1;
	`
	result, err := db.dbPool.Exec(context.Background(), query, id)

	if err == nil && result.RowsAffected() == 0 {
		return LinkNotFoundError
	}

	return err
}

func (db *DatabaseService) GetLatestLinks() ([]LinkDbo, error) {
	query := `
		SELECT id, url, alias, created_at
			FROM public.links
			WHERE deleted_at IS NULL
			ORDER BY created_at DESC;
	`
	// TODO(resultanyildizi): Add pagination
	rows, err := db.dbPool.Query(context.Background(), query)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var result []LinkDbo

	for rows.Next() {
		var link LinkDbo
		err := rows.Scan(&link.Id, &link.Url, &link.Alias, &link.CreatedAt)

		if err != nil {
			return nil, err
		}

		result = append(result, link)
	}

	return result, nil
}
