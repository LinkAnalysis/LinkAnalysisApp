package main

import (
	"context"
	"encoding/csv"
	"fmt"
	"os"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

func (a *App) ReadTextFile(path string) (string, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return "", err
	}
	return string(data), nil
}

func (a *App) ReadTextFileAntiMoney(path string, maxRows int) (string, error) {
	file, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer file.Close()

	r := csv.NewReader(file)
	r.FieldsPerRecord = -1

	records, err := r.ReadAll()
	if err != nil {
		return "", err
	}
	if len(records) == 0 {
		return "", nil
	}

	filtered := [][]string{records[0]}
	count := 0

	for _, row := range records[1:] {
		if maxRows > 0 && count >= maxRows {
			break
		}
		if row[1] == row[3] && row[2] == row[4] {
			continue
		}
		filtered = append(filtered, row)
		count++
	}

	var sb strings.Builder
	w := csv.NewWriter(&sb)
	if err := w.WriteAll(filtered); err != nil {
		return "", err
	}
	w.Flush()

	return sb.String(), nil
}

func (a *App) OpenFileExplorer() (string, error) {
	result, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		Title: "Select file",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "CSV File",
				Pattern:     "*.csv",
			},
		},
	})
	return result, err
}

func (a *App) SaveFileExplorer(fileName string, fileExt string) (string, error) {
	result, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title:           "Save as",
		DefaultFilename: fileName,
		Filters: []runtime.FileFilter{
			{
				DisplayName: fmt.Sprintf("%s File", strings.ToUpper(fileExt)),
				Pattern:     fmt.Sprintf("*.%s", strings.ToLower(fileExt)),
			},
		},
	})
	return result, err
}

func (a *App) SaveStringToFile(path string, content string) error {
	file, err := os.Create(path)
	if err != nil {
		return fmt.Errorf("failed to create file %s: %w", path, err)
	}
	defer file.Close()

	_, err = file.WriteString(content)

	if err != nil {
		return fmt.Errorf("failed to write to file %s: %w", path, err)
	}

	return nil
}

func (a *App) SaveBytesToFile(path string, content []byte) error {
	return os.WriteFile(path, content, 0644)
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
