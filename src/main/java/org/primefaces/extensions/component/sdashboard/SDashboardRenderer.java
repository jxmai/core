package org.primefaces.extensions.component.sdashboard;

import java.io.IOException;
import java.util.List;

import javax.faces.FacesException;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;

import org.primefaces.json.JSONArray;
import org.primefaces.json.JSONObject;
import org.primefaces.renderkit.CoreRenderer;
import org.primefaces.util.HTML;
import org.primefaces.util.WidgetBuilder;

public class SDashboardRenderer extends CoreRenderer {

    @Override
    public void encodeEnd(FacesContext context, UIComponent component) throws IOException {
        final SDashboard sDashBoard = (SDashboard) component;
        encodeMarkup(context, sDashBoard);
        encodeScript(context, sDashBoard);
    }

    /**
     * 
     * @param context
     * @param sDashBoard
     * @throws IOException
     */
    private void encodeMarkup(FacesContext context, final SDashboard sDashBoard)
            throws IOException {
        final ResponseWriter writer = context.getResponseWriter();
        final String clientId = sDashBoard.getClientId();
        final String widgetVar = sDashBoard.resolveWidgetVar();

        writer.startElement("ul", sDashBoard);
        writer.writeAttribute("style", "display: inline-block", "style");
        writer.writeAttribute("id", clientId, "id");
        writer.writeAttribute(HTML.WIDGET_VAR, widgetVar, null);
        writer.endElement("ul");
    }

    @Override
    public void decode(FacesContext context, UIComponent component) {
        decodeBehaviors(context, component);
    }

    /**
     * 
     * @param context
     * @param sDashBoard
     * @throws IOException
     */
    private void encodeScript(final FacesContext context, final SDashboard sDashBoard)
            throws IOException {
        final WidgetBuilder wb = getWidgetBuilder(context);
        final String clientId = sDashBoard.getClientId(context);

        @SuppressWarnings("unchecked")
        List<DefaultSDashboardModel> defaultSDashboardModels = (List<DefaultSDashboardModel>) sDashBoard
                .getValue();

        if (null == defaultSDashboardModels) {
            throw new FacesException(
                    "SDashboard must implement a model. Please provide a valid value attribute!");
        }

        JSONArray jsonArray = new JSONArray();
        for (int i = 0; i < defaultSDashboardModels.size(); i++) {
            DefaultSDashboardModel currentModel = defaultSDashboardModels.get(i);
            JSONObject object = new JSONObject();

            // TODO: move it to a different function / module
            String widgetTitleToDisplay = "";
            if (null != currentModel.getWidgetTitle()
                    && currentModel.getWidgetTitle().length() > 30) {
                widgetTitleToDisplay = currentModel.getWidgetTitle().substring(0, 30).concat("...");
            } else {
                widgetTitleToDisplay = currentModel.getWidgetTitle();
            }

            object.put("widgetTitle", widgetTitleToDisplay);
            object.put("widgetId", currentModel.getWidgetId());
            object.put("enableRefresh", currentModel.isEnableRefresh());
            object.put("widgetContent", currentModel.getWidgetContent());
            object.put("enableExpand", currentModel.isEnableExpand());
            object.put("enableAdd", currentModel.isEnableAdd());
            object.put("dashboardType", currentModel.getDashboardType());

            jsonArray.put(object);

        }

        wb.initWithDomReady("ExtSDashboard", sDashBoard.resolveWidgetVar(), clientId);

        // JSONObject object = new JSONObject();
        // object.put("widgetTitle", sDashBoard.getWidgetTitle());
        // object.put("widgetId", sDashBoard.getWidgetId());
        // TODO: to add enableRefresh option
        // object.put("enableRefresh", true);
        // object.put("widgetContent", sDashBoard.getWidgetContent());

        if (sDashBoard.getOnRefreshCallBack() != null) {
            wb.callback("refreshCallBack", "function(widgetId)", sDashBoard.getOnRefreshCallBack());
        }

        if (sDashBoard.getOnAddCallBack() != null) {
            wb.callback("addCallBack", "function(widgetId)", sDashBoard.getOnAddCallBack());
        }

        if (sDashBoard.getOnEditCallBack() != null) {
            wb.callback("editCallBack", "function(widgetId)", sDashBoard.getOnEditCallBack());
        }

        // wb.attr("dashboardData", "[" + object.toString() + "]");

        wb.attr("dashboardData", jsonArray.toString());

        encodeClientBehaviors(context, sDashBoard);

        wb.finish();
    }
}
