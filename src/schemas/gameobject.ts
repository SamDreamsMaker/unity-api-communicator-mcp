import { z } from "zod";
import type { CuratedSchema } from "../types.js";
import { Vector3Schema } from "./common.js";

export const gameobjectSchemas: Record<string, CuratedSchema> = {
  gameobject_create: {
    description:
      "Create a new GameObject in the active Unity scene. Can create primitives (Cube, Sphere, Capsule, Cylinder, Plane, Quad) or empty GameObjects. Supports setting initial transform and parent.",
    inputSchema: {
      name: z.string().describe("Name of the new GameObject"),
      type: z
        .string()
        .optional()
        .describe(
          "Primitive type: Cube, Sphere, Capsule, Cylinder, Plane, Quad. Omit for empty GameObject"
        ),
      position: Vector3Schema.optional().describe("Initial world position"),
      rotation: Vector3Schema.optional().describe("Initial rotation in euler angles"),
      scale: Vector3Schema.optional().describe("Initial local scale"),
      parentName: z
        .string()
        .optional()
        .describe("Name of an existing GameObject to set as parent"),
    },
    annotations: { destructiveHint: false, idempotentHint: false },
  },

  gameobject_delete: {
    description:
      "Delete a GameObject from the scene by name. The object and all its children will be destroyed.",
    inputSchema: {
      name: z.string().describe("Name of the GameObject to delete"),
    },
    annotations: { destructiveHint: true },
  },

  gameobject_transform: {
    description:
      "Set the transform (position, rotation, scale) of a GameObject. Only provided fields are modified.",
    inputSchema: {
      name: z.string().describe("Name of the target GameObject"),
      position: Vector3Schema.optional().describe("New world position"),
      rotation: Vector3Schema.optional().describe("New rotation in euler angles"),
      scale: Vector3Schema.optional().describe("New local scale"),
    },
    annotations: { idempotentHint: true },
  },

  gameobject_list: {
    description:
      "List all root GameObjects in the active scene with a 2-level hierarchy (root objects and their direct children). Returns name, active state, tag, layer, and child count.",
    inputSchema: {},
    annotations: { readOnlyHint: true },
  },

  gameobject_clone: {
    description:
      "Duplicate/clone a GameObject. The clone appears at the same position as the original.",
    inputSchema: {
      name: z.string().describe("Name of the GameObject to clone"),
      newName: z.string().optional().describe("Name for the cloned object (default: '<name> (Clone)')"),
    },
  },

  gameobject_active: {
    description: "Enable or disable a GameObject (set active/inactive).",
    inputSchema: {
      name: z.string().describe("Name of the GameObject"),
      active: z
        .boolean()
        .default(true)
        .describe("true to enable, false to disable"),
    },
    annotations: { idempotentHint: true },
  },

  gameobject_component_add: {
    description:
      "Add a component to a GameObject. Use Unity component type names like Rigidbody, BoxCollider, AudioSource, Light, etc.",
    inputSchema: {
      gameObjectName: z.string().describe("Name of the target GameObject"),
      componentType: z
        .string()
        .describe(
          "Unity component type name (e.g. Rigidbody, BoxCollider, AudioSource, MeshRenderer)"
        ),
    },
  },

  gameobject_component_remove: {
    description: "Remove a component from a GameObject by type name.",
    inputSchema: {
      name: z.string().describe("Name of the target GameObject"),
      componentType: z.string().describe("Component type name to remove"),
    },
    annotations: { destructiveHint: true },
  },

  gameobject_find_by_tag: {
    description:
      "Find all GameObjects with a specific tag. Returns name, active state, and layer for each match.",
    inputSchema: {
      tag: z.string().describe("Tag to search for (e.g. Player, MainCamera, Enemy)"),
    },
    annotations: { readOnlyHint: true },
  },

  gameobject_tag: {
    description: "Set the tag of a GameObject.",
    inputSchema: {
      name: z.string().describe("Name of the GameObject"),
      tag: z.string().describe("Tag to set (must be defined in Unity Tag Manager)"),
    },
    annotations: { idempotentHint: true },
  },

  gameobject_layer: {
    description:
      "Set the layer of a GameObject. Accepts layer number (0-31) or layer name.",
    inputSchema: {
      name: z.string().describe("Name of the GameObject"),
      layer: z
        .string()
        .describe("Layer number (0-31) or layer name (e.g. Default, UI, Water)"),
    },
    annotations: { idempotentHint: true },
  },
};
