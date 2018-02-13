using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace MultiSellerIo.Dal.Migrations
{
    public partial class changeset17 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "StateId",
                table: "ShippingCosts",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ShippingCosts_StateId",
                table: "ShippingCosts",
                column: "StateId");

            migrationBuilder.AddForeignKey(
                name: "FK_ShippingCosts_States_StateId",
                table: "ShippingCosts",
                column: "StateId",
                principalTable: "States",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ShippingCosts_States_StateId",
                table: "ShippingCosts");

            migrationBuilder.DropIndex(
                name: "IX_ShippingCosts_StateId",
                table: "ShippingCosts");

            migrationBuilder.DropColumn(
                name: "StateId",
                table: "ShippingCosts");
        }
    }
}
