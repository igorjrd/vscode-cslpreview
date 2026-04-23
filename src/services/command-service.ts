import type Command from "../commands/command";
import ChooseLocaleCommand from "../commands/choose-locale-command";
import RefreshPreviewCommand from "../commands/refresh-preview-command";
import ShowPreviewCommand from "../commands/show-preview-command";
import ShowSourceCommand from "../commands/show-source-command";

export default class CommandService {
  async executeShowPreview() {
    return new ShowPreviewCommand()
      .execute();
  }

  async executeRefreshPreview() {
    return new RefreshPreviewCommand()
      .execute();
  }

  async executeShowSource() {
    return new ShowSourceCommand()
      .execute();
  }

  async executeChooseLocale() {
    return new ChooseLocaleCommand()
      .execute();
  }
}