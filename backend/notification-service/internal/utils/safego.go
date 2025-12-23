package utils

import "log"

// SafeGo start goroutine with panic recovery
func SafeGo(f func()) {
	go func() {
		defer func() {
			if r := recover(); r != nil {
				log.Printf("[PANIC] goroutine recovered: %v", r)
			}
		}()
		f()
	}()
}
