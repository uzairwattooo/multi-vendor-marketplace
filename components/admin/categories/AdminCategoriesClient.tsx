"use client";

import { useMutation } from "@tanstack/react-query";
import {
    Edit3,
    FolderTree,
    ImageIcon,
    Loader2,
    Plus,
    Search,
    Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CategoryItem = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parentId: string | null;
    parentName: string | null;
    productCount: number;
    childCount: number;
};

type CategoryInput = {
    name: string;
    description: string | null;
    image: string | null;
    parentId: string | null;
};

async function saveCategory({
    categoryId,
    input,
}: {
    categoryId: string | null;
    input: CategoryInput;
}) {
    const response = await fetch(
        categoryId
            ? `/api/admin/categories/${categoryId}`
            : "/api/admin/categories",
        {
            method: categoryId ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        },
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Unable to save category");
    }

    return data;
}

async function deleteCategory(categoryId: string) {
    const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Unable to delete category");
    }

    return data;
}

export default function AdminCategoriesClient({
    categories,
}: {
    categories: CategoryItem[];
}) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] =
        useState<CategoryItem | null>(null);
    const [deleteTarget, setDeleteTarget] =
        useState<CategoryItem | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [parentId, setParentId] = useState("none");

    const filteredCategories = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) {
            return categories;
        }

        return categories.filter((currentCategory) =>
            [
                currentCategory.name,
                currentCategory.slug,
                currentCategory.description ?? "",
                currentCategory.parentName ?? "",
            ].some((value) =>
                value.toLowerCase().includes(normalizedQuery),
            ),
        );
    }, [categories, query]);

    const saveMutation = useMutation({
        mutationFn: saveCategory,
        onSuccess: (data) => {
            toast.success(data.message);
            closeDialog();
            router.refresh();
        },
        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to save category",
            );
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: (data) => {
            toast.success(data.message);
            setDeleteTarget(null);
            router.refresh();
        },
        onError: (error) => {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to delete category",
            );
        },
    });

    function openCreateDialog() {
        setEditingCategory(null);
        setName("");
        setDescription("");
        setImage("");
        setParentId("none");
        setDialogOpen(true);
    }

    function openEditDialog(currentCategory: CategoryItem) {
        setEditingCategory(currentCategory);
        setName(currentCategory.name);
        setDescription(currentCategory.description ?? "");
        setImage(currentCategory.image ?? "");
        setParentId(currentCategory.parentId ?? "none");
        setDialogOpen(true);
    }

    function closeDialog() {
        setDialogOpen(false);
        setEditingCategory(null);
        setName("");
        setDescription("");
        setImage("");
        setParentId("none");
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        saveMutation.mutate({
            categoryId: editingCategory?.id ?? null,
            input: {
                name: name.trim(),
                description: description.trim() || null,
                image: image.trim() || null,
                parentId: parentId === "none" ? null : parentId,
            },
        });
    }

    return (
        <>
            <div className="flex flex-col gap-3 rounded-3xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full max-w-xl">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search categories, slugs or parent groups..."
                        className="pl-9"
                    />
                </div>

                <Button
                    type="button"
                    onClick={openCreateDialog}
                    className="rounded-xl"
                >
                    <Plus className="size-4" />
                    Add Category
                </Button>
            </div>

            {filteredCategories.length === 0 ? (
                <div className="rounded-3xl border border-dashed bg-card px-6 py-16 text-center shadow-sm">
                    <FolderTree className="mx-auto size-8 text-muted-foreground" />
                    <h2 className="mt-4 text-lg font-semibold">
                        No categories found
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Try another search or create a new marketplace category.
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-sm">
                            <thead className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                                <tr>
                                    <th className="px-5 py-4 font-semibold">Category</th>
                                    <th className="px-5 py-4 font-semibold">Hierarchy</th>
                                    <th className="px-5 py-4 font-semibold">Products</th>
                                    <th className="px-5 py-4 font-semibold">Children</th>
                                    <th className="px-5 py-4 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredCategories.map((currentCategory) => (
                                    <tr
                                        key={currentCategory.id}
                                        className="transition-colors hover:bg-muted/25"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-muted/50">
                                                    {currentCategory.image ? (
                                                        <img
                                                            src={currentCategory.image}
                                                            alt={currentCategory.name}
                                                            className="size-full object-cover"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="size-5 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 max-w-[340px]">
                                                    <p className="truncate font-semibold">
                                                        {currentCategory.name}
                                                    </p>
                                                    <p className="mt-1 truncate text-xs text-muted-foreground">
                                                        /{currentCategory.slug}
                                                    </p>
                                                    {currentCategory.description && (
                                                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                                                            {currentCategory.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-medium">
                                                {currentCategory.parentName ?? "Root category"}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {currentCategory.parentId
                                                    ? "Child category"
                                                    : "Top-level navigation"}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-semibold">
                                                {currentCategory.productCount.toLocaleString()}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                catalog products
                                            </p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-semibold">
                                                {currentCategory.childCount.toLocaleString()}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                direct children
                                            </p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-xl"
                                                    onClick={() =>
                                                        openEditDialog(
                                                            currentCategory,
                                                        )
                                                    }
                                                >
                                                    <Edit3 className="size-3.5" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() =>
                                                        setDeleteTarget(
                                                            currentCategory,
                                                        )
                                                    }
                                                    aria-label={`Delete ${currentCategory.name}`}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Dialog
                open={dialogOpen}
                onOpenChange={(open) => {
                    if (!open) closeDialog();
                }}
            >
                <DialogContent className="w-full max-w-2xl p-0 overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader className="border-b px-6 py-5">
                            <DialogTitle>
                                {editingCategory
                                    ? "Edit category"
                                    : "Create category"}
                            </DialogTitle>
                            <DialogDescription>
                                Category names control marketplace filters and
                                product grouping.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-6">
                            <div className="space-y-2">
                                <Label htmlFor="category-name">Name</Label>
                                <Input
                                    id="category-name"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    minLength={2}
                                    maxLength={100}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category-parent">
                                    Parent category
                                </Label>
                                <select
                                    id="category-parent"
                                    value={parentId}
                                    onChange={(event) =>
                                        setParentId(event.target.value)
                                    }
                                    className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary/50 focus:ring-3 focus:ring-primary/10"
                                >
                                    <option value="none">No parent (root)</option>
                                    {categories
                                        .filter(
                                            (item) =>
                                                item.id !== editingCategory?.id,
                                        )
                                        .map((item) => (
                                            <option
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.name}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category-description">
                                    Description
                                </Label>
                                <Textarea
                                    id="category-description"
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(event.target.value)
                                    }
                                    rows={5}
                                    maxLength={1000}
                                    placeholder="Optional internal or customer-facing description"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category-image">
                                    Image URL
                                </Label>
                                <Input
                                    id="category-image"
                                    type="url"
                                    value={image}
                                    onChange={(event) =>
                                        setImage(event.target.value)
                                    }
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <DialogFooter className="border-t px-6 pb-8 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeDialog}
                                disabled={saveMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={saveMutation.isPending}
                            >
                                {saveMutation.isPending && (
                                    <Loader2 className="size-4 animate-spin" />
                                )}
                                {editingCategory
                                    ? "Save Changes"
                                    : "Create Category"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={Boolean(deleteTarget)}
                onOpenChange={(open) => {
                    if (!open) setDeleteTarget(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete category?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {deleteTarget?.name} can only be deleted when no
                            products or child categories still use it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteTarget) {
                                    deleteMutation.mutate(deleteTarget.id);
                                }
                            }}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending
                                ? "Deleting..."
                                : "Delete Category"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
