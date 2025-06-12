"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, Upload } from "lucide-react"

interface Todo {
  id: number
  task: string
  createdAt: string
}

export default function TodoTable() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, task: "Complete project documentation", createdAt: new Date().toLocaleDateString() },
    { id: 2, task: "Review code changes", createdAt: new Date().toLocaleDateString() },
    { id: 3, task: "Update dependencies", createdAt: new Date().toLocaleDateString() },
  ])
  const [newTodo, setNewTodo] = useState("")
  const [csvInput, setCsvInput] = useState("")

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      const todo: Todo = {
        id: Date.now(),
        task: newTodo.trim(),
        createdAt: new Date().toLocaleDateString(),
      }
      setTodos([...todos, todo])
      setNewTodo("")
    }
  }

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const bulkAddTodos = () => {
    if (csvInput.trim() === "") return

    const lines = csvInput.trim().split(",")
    const newTodos: Todo[] = []

    lines.forEach((line) => {
      const trimmedLine = line.trim()
      if (trimmedLine !== "") {
        // Handle both simple line format and CSV format
        const task = trimmedLine.includes(",") ? trimmedLine.split(",")[0].trim() : trimmedLine
        if (task) {
          newTodos.push({
            id: Date.now() + Math.random(),
            task: task,
            createdAt: new Date().toLocaleDateString(),
          })
        }
      }
    })

    if (newTodos.length > 0) {
      setTodos([...todos, ...newTodos])
      setCsvInput("")
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Todo List Manager</h1>
        <p className="text-muted-foreground">Manage your tasks with individual or bulk adding capabilities</p>
      </div>

      <div className="grid gap-6">
        <Tabs defaultValue="add-single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add-single">Add Single Todo</TabsTrigger>
            <TabsTrigger value="bulk-add">Bulk Add from CSV</TabsTrigger>
          </TabsList>

          <TabsContent value="add-single">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Todo
                </CardTitle>
                <CardDescription>Add a single todo item to your list</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter your todo item..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addTodo()
                      }
                    }}
                    className="flex-1"
                  />
                  <Button onClick={addTodo} disabled={!newTodo.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Todo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk-add">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Bulk Add Todos
                </CardTitle>
                <CardDescription>
                  Add multiple todos from CSV format. Enter todos separated by commas.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="csv-input">CSV Input</Label>
                  <Textarea
                    id="csv-input"
                    placeholder={`Example:
Complete project setup,Review documentation,Update README file,Fix bug in login form`}
                    value={csvInput}
                    onChange={(e) => setCsvInput(e.target.value)}
                    className="min-h-[120px] mt-2"
                  />
                </div>
                <Button onClick={bulkAddTodos} disabled={!csvInput.trim()} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Add All Todos
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Your Todos ({todos.length})</CardTitle>
            <CardDescription>Manage and track your todo items</CardDescription>
          </CardHeader>
          <CardContent>
            {todos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No todos yet. Add your first todo above!</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead className="w-[120px]">Created</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todos.map((todo, index) => (
                      <TableRow key={todo.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{todo.task}</TableCell>
                        <TableCell className="text-muted-foreground">{todo.createdAt}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTodo(todo.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete todo</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
