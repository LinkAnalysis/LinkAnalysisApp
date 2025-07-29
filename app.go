package main

import (
	"context"
	"encoding/csv"
	"fmt"
	"math"
	"os"
	"sort"
	"strconv"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
	"gonum.org/v1/gonum/mat"
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
				DisplayName: "CSV/GEXF File",
				Pattern:     "*.csv;*.gexf",
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

type EigenPair struct {
	Value   float64
	Index   int
	RealVec []float64
}

func (a *App) SpectralLayout(laplacian map[string]map[string]float32) map[string]map[string]float64 {
	rowKeys := make([]string, 0, len(laplacian))
	colKeySet := make(map[string]bool)
	for rowKey, cols := range laplacian {
		rowKeys = append(rowKeys, rowKey)
		for colKey := range cols {
			colKeySet[colKey] = true
		}
	}
	colKeys := make([]string, 0, len(colKeySet))
	for k := range colKeySet {
		colKeys = append(colKeys, k)
	}
	sort.Strings(rowKeys)
	sort.Strings(colKeys)

	data := make([]float64, 0, len(rowKeys)*len(colKeys))
	for _, rowKey := range rowKeys {
		row := laplacian[rowKey]
		for _, colKey := range colKeys {
			val := float64(row[colKey])
			data = append(data, val)
		}
	}
	r := len(rowKeys)
	c := len(colKeys)

	L := mat.NewDense(r, c, data)
	var eig mat.Eigen
	eig.Factorize(L, mat.EigenRight)
	values := eig.Values(nil)
	var cvecs mat.CDense
	eig.VectorsTo(&cvecs)

	pairs := make([]EigenPair, 0, len(values))
	rows, _ := cvecs.Dims()

	for i, val := range values {
		if math.Abs(real(val)) < 1e-10 {
			continue
		}
		vec := make([]float64, rows)
		for j := range rows {
			c := cvecs.At(j, i)
			vec[j] = real(c)
		}

		pairs = append(pairs, EigenPair{
			Value:   math.Abs(real(val)),
			Index:   i,
			RealVec: vec,
		})
	}

	sort.Slice(pairs, func(i, j int) bool {
		return pairs[i].Value < pairs[j].Value
	})

	vec2 := pairs[1].RealVec
	vec3 := pairs[2].RealVec

	res := make(map[string]map[string]float64)

	for i := range len(vec2) {
		res[strconv.Itoa(i)] = map[string]float64{
			"x": vec2[i],
			"y": vec3[i],
		}
	}

	return res
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
