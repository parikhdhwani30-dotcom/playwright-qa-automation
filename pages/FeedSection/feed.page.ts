import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../baseFile';

export class FeedPage extends BasePage {
  // 🔹 Navigation
  readonly feedNavBtn: Locator;
  readonly communityName: Locator;

  // 🔹 Post Editor
  readonly createPostInput: Locator;
  readonly postTextarea: Locator;
  readonly postBtn: Locator;
  readonly updateBtn: Locator;

  // 🔹 Attachments
  readonly addPhotoBtn: Locator;
  readonly addDocumentBtn: Locator;

  // 🔹 Engagement
  readonly likeBtn: Locator;
  readonly commentInput: Locator;
  readonly commentTextarea: Locator;
  readonly commentBtn: Locator;

  // 🔹 Post Actions
  readonly firstPostContainer: Locator;
  readonly postMenuBtn: Locator;
  readonly editOption: Locator;
  readonly deleteOption: Locator;
  readonly confirmDeleteBtn: Locator;
  readonly deleteSuccessMsg: Locator;

  constructor(page: Page) {
    super(page, '/sketchplay-dashboard'); // Call parent constructor

    // Navigation
    this.feedNavBtn = page.locator('#feed-nav-btn');
    this.communityName = page.getByText('HARdy 5556', { exact: true }).first();

    // Post Editor
    this.createPostInput = page.locator('#create-post-input');
    this.postTextarea = page.locator('#post-content-textarea');
    this.postBtn = page.getByRole('button', { name: 'Post' });
    this.updateBtn = page.getByRole('button', { name: 'Update' });

    // Attachments
    this.addPhotoBtn = page.getByText('Add Photo');
    this.addDocumentBtn = page.getByText('Add Document');

    // Engagement
    this.likeBtn = page.locator('button[id^="like-post"]');
    this.commentInput = page.getByPlaceholder('Your Comment');
    this.commentTextarea = page.getByRole('textbox', { name: 'Write your comment...' });
    this.commentBtn = page.getByRole('button', { name: 'Comment' });

    // Post Actions
    this.firstPostContainer = page.locator('div[id^="feed-post-"]').first();
    this.postMenuBtn = page.locator('button[id^="postMenu"]');
    this.editOption = page.getByText('Edit', { exact: true });
    this.deleteOption = page.getByText('Delete', { exact: true });
    this.confirmDeleteBtn = page.getByRole('button', { name: 'Yes, Delete' });
    this.deleteSuccessMsg = page.getByText('Post deleted successfully.');
  }

  async openFeed() {
    await this.feedNavBtn.click();
    await this.communityName.click();
  }

  // 🔹 ONLY opens editor (nothing else hidden)
  async openPostEditor() {
    await expect(this.createPostInput).toBeVisible();
    await this.createPostInput.click();
    await expect(this.postTextarea).toBeVisible();
  }

  async uploadPhoto(imagePath: string) {
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent('filechooser'),
      this.addPhotoBtn.click(),
    ]);

    await fileChooser.setFiles(imagePath);
  }

  async uploadDocument(docPath: string) {
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent('filechooser'),
      this.addDocumentBtn.click(),
    ]);

    await fileChooser.setFiles(docPath);
  }

  async addComment(comment: string, testInfo: any) {
    // Open comment editor
    await expect(this.commentInput.first()).toBeVisible();
    await this.commentInput.first().click();

    // Wait for actual textarea
    await expect(this.commentTextarea).toBeVisible();

    // Type comment
    await this.commentTextarea.fill(comment);
    await this.page.waitForTimeout(500);

    // Submit comment
    await this.commentBtn.click();

    // Wait for comment to be posted
    await this.page.waitForTimeout(2000);

    // Scroll to the first post to show the comment section
    await this.firstPostContainer.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);

    // Take screenshot showing the comment
    await this.takeScreenshot(testInfo, 'comment-added.png');
  }

  // ✅ Click 3-dot → Edit on FIRST (latest) post
  async editFirstPost() {
    // 1️⃣ first post card (latest post on top)
    await this.page.waitForTimeout(1000);

    // 2️⃣ click 3-dot menu inside FIRST post.
    await this.firstPostContainer.locator(this.postMenuBtn).click({ force: true });

    // 3️⃣ click Edit immediately
    await this.page.waitForTimeout(1000);
    await this.editOption.click({ force: true });
    await this.page.waitForTimeout(1000);
  }

  // ✅ Delete FIRST (latest) post
  async deleteFirstPost(testInfo: any) {
    // 1️⃣ open 3-dot menu
    await this.page.waitForTimeout(1000);
    await this.firstPostContainer.locator(this.postMenuBtn).click({ force: true });

    // 2️⃣ click Delete
    await this.page.waitForTimeout(3000);
    await this.deleteOption.click({ force: true });
    await this.page.waitForTimeout(1000);

    // 3️⃣ confirm
    await this.confirmDeleteBtn.click();

    // 4️⃣ success validation
    await expect(this.deleteSuccessMsg).toBeVisible();
    await this.page.waitForTimeout(1000);
    await this.takeScreenshot(testInfo, 'post-deleted.png');
    await this.deleteSuccessMsg.click();
  }
}
