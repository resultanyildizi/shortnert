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
		SELECT id, url, alias
			FROM public.links
			WHERE alias = $1 AND deleted_at IS NULL;
	`
	var result LinkDbo
	err := db.dbPool.QueryRow(context.Background(), query, alias).Scan(&result.Id, &result.Url, &result.Alias)

	if err != nil {
		return nil, err
	}
	return &result, nil
}

func (db *DatabaseService) AddLink(alias string, url string) (*LinkDbo, error) {
	query := `
		INSERT INTO public.links(alias, url)
			VALUES ($1, $2)
			RETURNING id, alias, url;
	`
	var result LinkDbo
	err := db.dbPool.QueryRow(context.Background(), query, alias, url).Scan(&result.Id, &result.Alias, &result.Url)

	if err != nil {
		return nil, err
	}

	return &result, nil
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
