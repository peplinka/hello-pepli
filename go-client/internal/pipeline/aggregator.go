package pipeline

import (
	"clinic-auth/internal/models"
)

// Fan-In: собираем результаты всех валидаторов
func FanInValidators(channels ...<-chan models.ValidationResult) <-chan []models.ValidationResult {
	out := make(chan []models.ValidationResult, 1)
	
	go func() {
		defer close(out)
		results := make([]models.ValidationResult, 0, len(channels))
		
		// Читаем из всех каналов
		for _, ch := range channels {
			for result := range ch {
				results = append(results, result)
			}
		}
		out <- results
	}()
	
	return out
}

// Проверка: все ли валидации прошли
func AllValid(results []models.ValidationResult) (bool, []string) {
	var errors []string
	for _, r := range results {
		if !r.IsValid {
			errors = append(errors, r.Field+": "+r.Error.Error())
		}
	}
	return len(errors) == 0, errors
}