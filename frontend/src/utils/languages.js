export const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', monacoLang: 'javascript', ext: 'js' },
  { id: 'python', label: 'Python', monacoLang: 'python', ext: 'py' },
  { id: 'cpp', label: 'C++', monacoLang: 'cpp', ext: 'cpp' },
  { id: 'java', label: 'Java', monacoLang: 'java', ext: 'java' },
  { id: 'c', label: 'C', monacoLang: 'c', ext: 'c' },
  { id: 'typescript', label: 'TypeScript', monacoLang: 'typescript', ext: 'ts' },
  { id: 'rust', label: 'Rust', monacoLang: 'rust', ext: 'rs' },
  { id: 'go', label: 'Go', monacoLang: 'go', ext: 'go' },
];

export const DEFAULT_CODE = {
  javascript: `// Codex Pages — JavaScript
  
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci sequence:");
for (let i = 0; i < 10; i++) {
  console.log(\`fib(\${i}) = \${fibonacci(i)}\`);
}`,

  python: `# Codex Pages — Python

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print("Fibonacci sequence:")
for i in range(10):
    print(f"fib({i}) = {fibonacci(i)}")`,

  cpp: `// Codex Pages — C++

#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    cout << "Fibonacci sequence:" << endl;
    for (int i = 0; i < 10; i++) {
        cout << "fib(" << i << ") = " << fibonacci(i) << endl;
    }
    return 0;
}`,

  java: `// Codex Pages — Java

public class Main {
    static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }

    public static void main(String[] args) {
        System.out.println("Fibonacci sequence:");
        for (int i = 0; i < 10; i++) {
            System.out.println("fib(" + i + ") = " + fibonacci(i));
        }
    }
}`,

  c: `// Codex Pages — C

#include <stdio.h>

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    printf("Fibonacci sequence:\\n");
    for (int i = 0; i < 10; i++) {
        printf("fib(%d) = %d\\n", i, fibonacci(i));
    }
    return 0;
}`,

  typescript: `// Codex Pages — TypeScript

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci sequence:");
for (let i = 0; i < 10; i++) {
  console.log(\`fib(\${i}) = \${fibonacci(i)}\`);
}`,

  rust: `// Codex Pages — Rust

fn fibonacci(n: u32) -> u32 {
    match n {
        0 | 1 => n,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

fn main() {
    println!("Fibonacci sequence:");
    for i in 0..10 {
        println!("fib({}) = {}", i, fibonacci(i));
    }
}`,

  go: `// Codex Pages — Go

package main

import "fmt"

func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
    fmt.Println("Fibonacci sequence:")
    for i := 0; i < 10; i++ {
        fmt.Printf("fib(%d) = %d\\n", i, fibonacci(i))
    }
}`,
};

export function getLanguageById(id) {
  return LANGUAGES.find(l => l.id === id) || LANGUAGES[0];
}
