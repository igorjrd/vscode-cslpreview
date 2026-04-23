import Command from "./command";
import PreviewService from '../services/preview-service';
import Preview from "../models/preview";
import Optional from "../models/optional";

export default class RefreshPreviewCommand implements Command<Optional<Preview>> {
  async execute(): Promise<Optional<Preview>> {
    let previewPromise = PreviewService.getActivePreview();

    if (previewPromise.isPresent()) {
      const preview = previewPromise.get();
      PreviewService.refreshPreview(preview);
    }
    return previewPromise;
  }
}