/**
 * Copyright 2011-2018 PrimeFaces Extensions
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.primefaces.extensions.component.sdashboard;

/**
 * 
 * @author jm
 *
 */
public class DefaultSDashboardModel {

    private String widgetTitle;

    private String widgetId;

    private String widgetContent;

    private boolean enableRefresh;

    private String dashboardType;

    // Default true
    private boolean enableExpand = true;

    private boolean enableAdd = true;

    public DefaultSDashboardModel() {
        super();
    }

    public DefaultSDashboardModel(String widgetTitle, String widgetId, String widgetContent) {
        super();
        this.widgetTitle = widgetTitle;
        this.widgetId = widgetId;
        this.widgetContent = widgetContent;
    }

    public DefaultSDashboardModel(String widgetTitle, String widgetId, String widgetContent,
            boolean enableRefresh) {
        super();
        this.widgetTitle = widgetTitle;
        this.widgetId = widgetId;
        this.widgetContent = widgetContent;
        this.enableRefresh = enableRefresh;
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

    public boolean isEnableRefresh() {
        return enableRefresh;
    }

    public void setEnableRefresh(boolean enableRefresh) {
        this.enableRefresh = enableRefresh;
    }

    public boolean isEnableExpand() {
        return enableExpand;
    }

    public void setEnableExpand(boolean enableExpand) {
        this.enableExpand = enableExpand;
    }

    public boolean isEnableAdd() {
        return enableAdd;
    }

    public void setEnableAdd(boolean enableAdd) {
        this.enableAdd = enableAdd;
    }

    public String getDashboardType() {
        return dashboardType;
    }

    public void setDashboardType(String dashboardType) {
        this.dashboardType = dashboardType;
    }

}
