package org.primefaces.extensions.component.sdashboard;

public class DefaultSDashboardModel {

    private String widgetTitle;

    private String widgetId;

    private String widgetContent;

    public DefaultSDashboardModel() {
        super();
    }

    public DefaultSDashboardModel(String widgetTitle, String widgetId, String widgetContent) {
        super();
        this.widgetTitle = widgetTitle;
        this.widgetId = widgetId;
        this.widgetContent = widgetContent;
    }

    public String getWidgetTitle() {
        return widgetTitle;
    }

    public void setWidgetTitle(String widgetTitle) {
        this.widgetTitle = widgetTitle;
    }

    public String getWidgetId() {
        return widgetId;
    }

    public void setWidgetId(String widgetId) {
        this.widgetId = widgetId;
    }

    public String getWidgetContent() {
        return widgetContent;
    }

    public void setWidgetContent(String widgetContent) {
        this.widgetContent = widgetContent;
    }

}
