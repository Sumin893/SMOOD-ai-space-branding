export type InteriorRenderResult = {
  imageUrl: string;
  generatedAt: string;
};

export async function generateInteriorRender(): Promise<InteriorRenderResult> {
  await new Promise((resolve) => window.setTimeout(resolve, 3200));

  return {
    imageUrl: "/renders/dessert-cafe.png",
    generatedAt: new Date().toISOString(),
  };
}
