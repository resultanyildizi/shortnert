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

func (db *DatabaseService) GetLinkByKey(key string) (*LinkDbo, error) {
	query := `
		SELECT id, url, key
			FROM public.links
			WHERE key = $1 AND deleted_at IS NULL;
	`
	var result LinkDbo
	err := db.dbPool.QueryRow(context.Background(), query, key).Scan(&result.Id, &result.Url, &result.Key)

	if err != nil {
		return nil, err
	}
	return &result, nil
}

func (db *DatabaseService) AddLink(key string, url string) (*LinkDbo, error) {
	query := `
		INSERT INTO public.links(key, url)
			VALUES ($1, $2)
			RETURNING id, key, url;
	`
	var result LinkDbo
	err := db.dbPool.QueryRow(context.Background(), query, key, url).Scan(&result.Id, &result.Key, &result.Url)

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
